import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CheckCircle, User, MessageCircle, Lightbulb, Calendar } from 'lucide-react';

interface ReviewStepV2Props {
  form: UseFormReturn<any>;
  data: any;
  workshop: { id: string; title: string };
}

export const ReviewStepV2: React.FC<ReviewStepV2Props> = ({ data, workshop }) => {
  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case 'email': return '📧';
      case 'phone': return '📞';
      case 'sms': return '📱';
      case 'whatsapp': return '💬';
      default: return '📧';
    }
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'first-time': return 'New to Apple';
      case 'switching': return 'Switching Platforms';
      case 'experienced': return 'Apple User';
      default: return type;
    }
  };

  const getPaidInterestLabel = (interest: string) => {
    switch (interest) {
      case 'yes': return 'Interested in premium training';
      case 'maybe': return 'Maybe interested in future';
      case 'no': return 'Free training only';
      default: return interest;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-ios-title2 font-sf-pro font-semibold text-text">
          Review Your Registration
        </h2>
        <p className="text-ios-body text-text-muted">
          Please confirm your details before submitting
        </p>
      </div>

      {/* Workshop Info */}
      <Card className="p-6 bg-accent-a/5 border-accent-a/20 rounded-xl2">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-accent-a" />
          <div>
            <h3 className="text-ios-callout font-sf-pro font-semibold text-text">
              Workshop Registration
            </h3>
            <p className="text-ios-body text-text">
              {workshop.title}
            </p>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6 bg-surface-2 border-0 rounded-xl2">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-accent-a" />
            <h3 className="text-ios-callout font-sf-pro font-semibold text-text">
              Personal Information
            </h3>
          </div>
          
          <div className="space-y-3 pl-8">
            <div className="flex justify-between items-center">
              <span className="text-ios-body text-text-muted">Name:</span>
              <span className="text-ios-body font-medium text-text">{data.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-ios-body text-text-muted">Email:</span>
              <span className="text-ios-body font-medium text-text">{data.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-ios-body text-text-muted">Experience:</span>
              <Badge variant="secondary" className="bg-accent-a/10 text-accent-a border-0">
                {getUserTypeLabel(data.userType)}
              </Badge>
            </div>
            {data.phone && (
              <div className="flex justify-between items-center">
                <span className="text-ios-body text-text-muted">Phone:</span>
                <span className="text-ios-body font-medium text-text">{data.phone}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Contact Preferences */}
      <Card className="p-6 bg-surface-2 border-0 rounded-xl2">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-5 h-5 text-accent-a" />
            <h3 className="text-ios-callout font-sf-pro font-semibold text-text">
              Contact Preferences
            </h3>
          </div>
          
          <div className="space-y-3 pl-8">
            <div className="flex justify-between items-center">
              <span className="text-ios-body text-text-muted">Preferred method:</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getContactMethodIcon(data.contactPreference)}</span>
                <span className="text-ios-body font-medium text-text capitalize">
                  {data.contactPreference}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-ios-body text-text-muted">Updates:</span>
              <Badge variant={data.receiveUpdates ? "default" : "secondary"}>
                {data.receiveUpdates ? 'Yes, keep me updated' : 'No updates'}
              </Badge>
            </div>
            {data.platformSwitch && (
              <div className="flex justify-between items-center">
                <span className="text-ios-body text-text-muted">Switching from:</span>
                <span className="text-ios-body font-medium text-text capitalize">
                  {data.platformSwitch}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Learning Preferences */}
      <Card className="p-6 bg-surface-2 border-0 rounded-xl2">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Lightbulb className="w-5 h-5 text-accent-a" />
            <h3 className="text-ios-callout font-sf-pro font-semibold text-text">
              Learning Preferences
            </h3>
          </div>
          
          <div className="space-y-4 pl-8">
            <div>
              <span className="text-ios-body text-text-muted">Main tasks:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.mainTasks?.map((task: string) => (
                  <Badge key={task} variant="outline" className="bg-accent-a/5 border-accent-a/20">
                    {task}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <span className="text-ios-body text-text-muted">Learning styles:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.learningStyles?.map((style: string) => (
                  <Badge key={style} variant="outline" className="bg-accent-a/5 border-accent-a/20">
                    {style}
                  </Badge>
                ))}
              </div>
            </div>

            {data.otherTopics && (
              <div>
                <span className="text-ios-body text-text-muted">Additional interests:</span>
                <p className="text-ios-body text-text mt-1 p-3 bg-surface rounded-lg">
                  {data.otherTopics}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-ios-body text-text-muted">Premium training:</span>
              <Badge variant="secondary" className="bg-surface border-0">
                {getPaidInterestLabel(data.paidTrainingInterest)}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Final Note */}
      <div className="text-center p-4 bg-accent-a/5 rounded-xl2">
        <p className="text-ios-footnote text-text-muted">
          By submitting this form, you agree to receive workshop notifications and updates
          according to your preferences above.
        </p>
      </div>
    </div>
  );
};