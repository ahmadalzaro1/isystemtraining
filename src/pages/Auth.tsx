import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { linkRegsToUser } from "@/lib/registration/manageLink";
import { validatePassword } from '@/utils/passwordValidation';
import { validateEmail, validateName, authRateLimiter } from '@/utils/inputValidation';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';


const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'fair' | 'good' | 'strong';
  }>({ isValid: false, errors: [], strength: 'weak' });
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  
  const { signIn, signUp, user, isAdmin, loading: authLoading } = useAuth();
  const { monitorFailedAuthAttempts } = useSecurityMonitoring();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !authLoading) {
      
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Email validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!;
    }
    
    // Password validation - only for sign up, not sign in
    if (isSignUp && !passwordValidation.isValid) {
      errors.password = 'Password does not meet security requirements';
    }
    
    // Name validation for sign up
    if (isSignUp) {
      const firstNameValidation = validateName(firstName, 'First name');
      if (!firstNameValidation.isValid) {
        errors.firstName = firstNameValidation.error!;
      }
      
      const lastNameValidation = validateName(lastName, 'Last name');
      if (!lastNameValidation.isValid) {
        errors.lastName = lastNameValidation.error!;
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    // Check rate limiting
    const clientId = `${window.navigator.userAgent}_${email || 'anonymous'}`;
    const rateLimitCheck = authRateLimiter.checkRateLimit(clientId);
    
    if (!rateLimitCheck.allowed) {
      const minutes = Math.ceil(rateLimitCheck.remainingTime! / 60);
      setError(`Too many attempts. Please try again in ${minutes} minute(s).`);
      return;
    }
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName
        });
        
        if (error) {
          setError(error.message);
          monitorFailedAuthAttempts(true);
        } else {
          setMessage('Account created successfully! You can now sign in.');
          authRateLimiter.reset(clientId);
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error('Sign in error:', error);
          setError(error.message);
          monitorFailedAuthAttempts(true);
        } else {
          monitorFailedAuthAttempts(false);
          authRateLimiter.reset(clientId);
          try { await linkRegsToUser(email); } catch {}
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      monitorFailedAuthAttempts(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp 
              ? 'Enter your details to create your account' 
              : 'Enter your credentials to access your account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className={validationErrors.firstName ? 'border-red-500' : ''}
                    />
                    {validationErrors.firstName && (
                      <p className="text-sm text-red-600">{validationErrors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className={validationErrors.lastName ? 'border-red-500' : ''}
                    />
                    {validationErrors.lastName && (
                      <p className="text-sm text-red-600">{validationErrors.lastName}</p>
                    )}
                  </div>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  const newPassword = e.target.value;
                  setPassword(newPassword);
                  // Only validate password strength during sign-up
                  if (isSignUp) {
                    const validation = validatePassword(newPassword);
                    setPasswordValidation(validation);
                  }
                  setShowPasswordStrength(newPassword.length > 0 && isSignUp);
                }}
                onFocus={() => setShowPasswordStrength(isSignUp)}
                required
                minLength={8}
                className={validationErrors.password ? 'border-red-500' : ''}
              />
              {validationErrors.password && (
                <p className="text-sm text-red-600">{validationErrors.password}</p>
              )}
              <PasswordStrengthIndicator 
                strength={passwordValidation.strength}
                errors={passwordValidation.errors}
                show={showPasswordStrength}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;