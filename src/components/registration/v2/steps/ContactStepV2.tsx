import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Phone, MessageCircle, Mail, Smartphone, Bell } from 'lucide-react';

interface ContactStepV2Props {
  form: UseFormReturn<any>;
  data: any;
}

const CONTACT_PREFERENCES = [
  { value: 'email', label: 'Email', icon: Mail, description: 'Best for detailed info' },
  { value: 'phone', label: 'Phone Call', icon: Phone, description: 'Direct conversation' },
  { value: 'sms', label: 'Text Message', icon: Smartphone, description: 'Quick updates' },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, description: 'Easy messaging' },
];


export const ContactStepV2: React.FC<ContactStepV2Props> = ({ form, data }) => {

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-accent-a/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-accent-a" />
        </div>
        <h2 className="text-ios-title2 font-sf-pro font-semibold text-text">
          Stay Connected
        </h2>
        <p className="text-ios-body text-text-muted">
          How would you like us to reach you?
        </p>
      </div>

      {/* Phone Number */}
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-ios-callout font-sf-pro font-medium text-text">
              Phone Number
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <Input
                  {...field}
                  type="tel"
                  placeholder="07XXXXXXXX"
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

      {/* Contact Preference */}
      <FormField
        control={form.control}
        name="contactPreference"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel className="text-ios-callout font-sf-pro font-medium text-text">
              Preferred Contact Method
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-1 gap-3"
              >
                {CONTACT_PREFERENCES.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "relative flex items-center space-x-3 p-4 rounded-xl2",
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
                        className="flex items-center space-x-3 cursor-pointer flex-1"
                      >
                        <Icon className="w-5 h-5 text-accent-a" />
                        <div className="flex-1">
                          <div className="text-ios-callout font-sf-pro font-medium text-text">
                            {option.label}
                          </div>
                          <div className="text-ios-footnote text-text-muted">
                            {option.description}
                          </div>
                        </div>
                        {field.value === option.value && (
                          <div className="w-5 h-5 bg-accent-a rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Updates Preference */}
      <FormField
        control={form.control}
        name="receiveUpdates"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <div className={cn(
              "flex items-start space-x-4 p-4 rounded-xl2 bg-surface-2",
              "hover:bg-surface transition-colors duration-200"
            )}>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1"
                />
              </FormControl>
              <div className="flex-1 space-y-1">
                <FormLabel className="text-ios-callout font-sf-pro font-medium text-text cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-accent-a" />
                    <span>Keep me updated</span>
                  </div>
                </FormLabel>
                <p className="text-ios-footnote text-text-muted">
                  Receive notifications about new workshops and Apple tips
                </p>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};