import React, { useCallback, useTransition } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  Settings, BookOpen, Video, Users, Lightbulb, Shield, 
  Cloud, Smartphone, Home, Briefcase, GraduationCap, Palette 
} from 'lucide-react';

interface PreferencesStepV2Props {
  form: UseFormReturn<any>;
  data: any;
}

const MAIN_TASKS = [
  { value: 'email', label: 'Email & Messages', icon: '📧' },
  { value: 'productivity', label: 'Work & Documents', icon: '📊' },
  { value: 'creative', label: 'Photos & Videos', icon: '🎨' },
  { value: 'communication', label: 'Calls & Video Chat', icon: '📞' },
  { value: 'entertainment', label: 'Music & Movies', icon: '🎵' },
  { value: 'social', label: 'Social Media', icon: '👥' },
];

const LEARNING_STYLES = [
  { value: 'videos', label: 'Video Tutorials', icon: Video, description: 'Watch and learn' },
  { value: 'guides', label: 'Step-by-step Guides', icon: BookOpen, description: 'Written instructions' },
  { value: 'hands-on', label: 'Hands-on Practice', icon: Settings, description: 'Learn by doing' },
  { value: 'qa', label: 'Q&A Sessions', icon: Users, description: 'Ask questions live' },
];

const PAID_INTEREST_OPTIONS = [
  { value: 'yes', label: 'Yes, I\'m interested', description: 'Tell me about premium training' },
  { value: 'maybe', label: 'Maybe in the future', description: 'Keep me informed' },
  { value: 'no', label: 'Free training only', description: 'Just the free workshops' },
];

export const PreferencesStepV2: React.FC<PreferencesStepV2Props> = ({ form, data }) => {
  const [isPending, startTransition] = useTransition();

  const handleTaskToggle = useCallback((taskValue: string, checked: boolean, currentValue: string[]) => {
    startTransition(() => {
      const updated = checked
        ? currentValue.length < 3 ? [...currentValue, taskValue] : currentValue
        : currentValue.filter((t: string) => t !== taskValue);
      form.setValue('mainTasks', updated);
      form.trigger('mainTasks');
    });
  }, [form]);

  const handleStyleToggle = useCallback((styleValue: string, checked: boolean, currentValue: string[]) => {
    startTransition(() => {
      const updated = checked
        ? [...currentValue, styleValue]
        : currentValue.filter((s: string) => s !== styleValue);
      form.setValue('learningStyles', updated);
      form.trigger('learningStyles');
    });
  }, [form]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-accent-a/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="w-8 h-8 text-accent-a" />
        </div>
        <h2 className="text-ios-title2 font-sf-pro font-semibold text-text">
          Your Learning Preferences
        </h2>
        <p className="text-ios-body text-text-muted">
          Help us tailor the perfect workshops for you
        </p>
      </div>

      {/* Main Tasks */}
      <FormField
        control={form.control}
        name="mainTasks"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel className="text-ios-callout font-sf-pro font-medium text-text">
              What do you primarily use your Apple devices for? (Select up to 3)
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MAIN_TASKS.map((task) => {
                  const isSelected = (field.value || []).includes(task.value);
                  const isDisabled = !isSelected && (field.value || []).length >= 3;
                  
                  return (
                    <div
                      key={task.value}
                      className={cn(
                        "relative flex items-center space-x-3 p-4 rounded-xl2",
                        "bg-surface-2 border-2 border-transparent",
                        "hover:bg-surface transition-all duration-200",
                        isSelected && "border-accent-a bg-accent-a/5",
                        isDisabled && "opacity-50"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleTaskToggle(task.value, checked as boolean, field.value || [])}
                        disabled={isDisabled || isPending}
                      />
                      <div className="text-xl">{task.icon}</div>
                      <div className="text-ios-callout font-sf-pro font-medium text-text">
                        {task.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Learning Styles */}
      <FormField
        control={form.control}
        name="learningStyles"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel className="text-ios-callout font-sf-pro font-medium text-text">
              How do you prefer to learn new features?
            </FormLabel>
            <FormControl>
              <div className="space-y-3">
                {LEARNING_STYLES.map((style) => {
                  const Icon = style.icon;
                  const isSelected = (field.value || []).includes(style.value);
                  
                  return (
                    <div
                      key={style.value}
                      className={cn(
                        "relative flex items-center space-x-4 p-4 rounded-xl2",
                        "bg-surface-2 border-2 border-transparent",
                        "hover:bg-surface transition-all duration-200",
                        isSelected && "border-accent-a bg-accent-a/5"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleStyleToggle(style.value, checked as boolean, field.value || [])}
                        disabled={isPending}
                      />
                      <Icon className="w-5 h-5 text-accent-a" />
                      <div className="flex-1">
                        <div className="text-ios-callout font-sf-pro font-medium text-text">
                          {style.label}
                        </div>
                        <div className="text-ios-footnote text-text-muted">
                          {style.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Additional Topics */}
      <FormField
        control={form.control}
        name="otherTopics"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-ios-callout font-sf-pro font-medium text-text">
              Any specific topics you'd like to learn about? (Optional)
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="e.g., iCloud setup, photo organization, accessibility features..."
                className={cn(
                  "min-h-[100px] p-4 text-ios-body bg-surface-2 border-0",
                  "rounded-xl2 focus:ring-2 focus:ring-accent-a/30",
                  "placeholder:text-text-muted resize-none"
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Paid Training Interest */}
      <FormField
        control={form.control}
        name="paidTrainingInterest"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel className="text-ios-callout font-sf-pro font-medium text-text">
              Interest in Premium Training
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-3"
              >
                {PAID_INTEREST_OPTIONS.map((option) => (
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
                      id={`paid-${option.value}`}
                      className="sr-only"
                    />
                    <Label 
                      htmlFor={`paid-${option.value}`}
                      className="flex items-center space-x-4 cursor-pointer flex-1"
                    >
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