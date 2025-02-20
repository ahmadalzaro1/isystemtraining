
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormData } from "@/types/registration";

interface RegistrationSuccessProps {
  data: FormData;
  onReset: () => void;
}

export const RegistrationSuccess = ({ data, onReset }: RegistrationSuccessProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Registration Complete! 🎉</h2>
        <p className="text-muted-foreground">
          Thank you for registering, {data.name}! We'll keep you updated via {data.contactPreference}.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Selected Topics:</h3>
        <ul className="list-disc pl-5 space-y-2">
          {data.workshopTopics.map((topic) => (
            <li key={topic.topic}>{topic.topic}</li>
          ))}
        </ul>
      </div>

      {data.otherTopics && (
        <div className="space-y-2">
          <h3 className="font-medium">Additional Topics Requested:</h3>
          <p className="text-muted-foreground">{data.otherTopics}</p>
        </div>
      )}

      <div className="pt-4">
        <Button onClick={onReset} className="w-full">
          Register Another Person
        </Button>
      </div>
    </Card>
  );
};
