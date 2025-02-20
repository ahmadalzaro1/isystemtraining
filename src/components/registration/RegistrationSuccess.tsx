
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RegistrationSuccessProps {
  workshop: any;
  onViewWorkshops: () => void;
}

export const RegistrationSuccess = ({ workshop, onViewWorkshops }: RegistrationSuccessProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Registration Complete! 🎉</h2>
        <p className="text-muted-foreground">
          You have successfully registered for the workshop "{workshop.name}"
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Workshop Details:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Date: {workshop.date.toLocaleDateString()}</li>
          <li>Time: {workshop.time}</li>
          <li>Duration: {workshop.duration}</li>
          <li>Available Seats: {workshop.availableSeats}</li>
        </ul>
      </div>

      <div className="pt-4">
        <Button onClick={onViewWorkshops} className="w-full">
          View More Workshops
        </Button>
      </div>
    </Card>
  );
};
