export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation with RFC compliant regex
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /[<>]/,  // HTML injection attempts
    /javascript:/i,  // JS injection
    /on\w+=/i,  // Event handlers
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(email))) {
    return { isValid: false, error: 'Email contains invalid characters' };
  }
  
  return { isValid: true };
};

// Phone validation for Jordanian numbers
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Jordanian phone patterns: +962, 00962, or local 07/09
  const jordanianPatterns = [
    /^962[79]\d{8}$/,     // +962 format
    /^00962[79]\d{8}$/,   // 00962 format
    /^0[79]\d{8}$/,       // Local format
    /^[79]\d{8}$/,        // Without leading zero
  ];
  
  const isValid = jordanianPatterns.some(pattern => pattern.test(cleanPhone));
  
  if (!isValid) {
    return { 
      isValid: false, 
      error: 'Please enter a valid Jordanian phone number (07XXXXXXXX or 09XXXXXXXX)' 
    };
  }
  
  return { isValid: true };
};

// Name validation
export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: `${fieldName} must be less than 50 characters` };
  }
  
  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  // Check for XSS patterns
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];
  
  if (xssPatterns.some(pattern => pattern.test(name))) {
    return { isValid: false, error: `${fieldName} contains invalid characters` };
  }
  
  return { isValid: true };
};

// Sanitize text input to prevent XSS
export const sanitizeTextInput = (input: string): string => {
  return input
    .replace(/[<>'"&]/g, '') // Remove potentially dangerous characters
    .trim()
    .substring(0, 500); // Limit length
};

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  checkRateLimit(identifier: string): { allowed: boolean; remainingTime?: number } {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true };
    }
    
    if (record.count >= this.maxAttempts) {
      return { 
        allowed: false, 
        remainingTime: Math.ceil((record.resetTime - now) / 1000) 
      };
    }
    
    record.count++;
    return { allowed: true };
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Global rate limiter for auth attempts
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes