import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { User, Mail, Sparkles } from 'lucide-react';

interface PersonalInfoStepV2Props {
  form: UseFormReturn<any>;
  data: any;
}

const USER_TYPE_OPTIONS = [
  {
    value: 'first-time',
    label: 'New to Apple',
    description: 'Just got my first Apple device',
    icon: '🌟',
  },
  {
    value: 'switching',
    label: 'Switching Platforms',
    description: 'Coming from Windows/Android',
    icon: '🔄',
  },
  {
    value: 'experienced',
    label: 'Apple User',
    description: 'Already use Apple devices',
    icon: '🍎',
  },
];

export const PersonalInfoStepV2: React.FC<PersonalInfoStepV2Props> = ({ form }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-accent-a/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-accent-a" />
        </div>
        <h2 className="text-ios-title2 font-sf-pro font-semibold text-text">
          Let's get to know you
        </h2>
        <p className="text-ios-body text-text-muted">
          Help us personalize your learning experience
        </p>
      </div>

      {/* Name Field */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-ios-callout font-sf-pro font-medium text-text">
              Your Name
            </FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <Input
                  {...field}
                  placeholder="Enter your full name"
                  className={cn(
                    "h-14 pl-12 pr-4 text-ios-body bg-surface-2 border-0",
                    "rounded-xl2 focus:ring-2 focus:ring-accent-a/30",
                    "placeholder:text-text-muted"
                  )}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email Field */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-ios-callout font-sf-pro font-medium text-text">
              Email Address
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <Input
                  {...field}
                  type="email"
                  placeholder="your@email.com"
                  className={cn(
                    "h-14 pl-12 pr-4 text-ios-body bg-surface-2 border-0",
                    "rounded-xl2 focus:ring-2 focus:ring-accent-a/30",
                    "placeholder:text-text-muted"
                  )}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* User Type Selection */}
      <FormField
        control={form.control}
        name="userType"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel className="text-ios-callout font-sf-pro font-medium text-text">
              Your Apple Experience
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-3"
              >
                {USER_TYPE_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "relative flex items-center space-x-4 p-4 rounded-xl2",
                      "bg-surface-2 border-2 border-transparent",
                      "hover:bg-surface cursor-pointer transition-all duration-200",
                      field.value === option.value && "border-accent-a bg-accent-a/5"
                    )}
                  >
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value}
                      className="sr-only"
                    />
                    <Label 
                      htmlFor={option.value}
                      className="flex items-center space-x-4 cursor-pointer flex-1"
                    >
                      <div className="text-2xl">{option.icon}</div>
                      <div className="flex-1">
                        <div className="text-ios-callout font-sf-pro font-medium text-text">
                          {option.label}
                        </div>
                        <div className="text-ios-footnote text-text-muted">
                          {option.description}
                        </div>
                      </div>
                      {field.value === option.value && (
                        <div className="w-6 h-6 bg-accent-a rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};