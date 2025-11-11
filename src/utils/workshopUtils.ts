
import { Workshop } from "@/types/workshop";

export const isWorkshopTrending = (workshop: Workshop): boolean => {
  return workshop.spotsRemaining <= 4;
};

export const isWorkshopAlmostFull = (workshop: Workshop): boolean => {
  return workshop.spotsRemaining <= 2;
};

export const getSpotPercentage = (workshop: Workshop, totalSeats: number): number => {
  return ((totalSeats - workshop.spotsRemaining) / totalSeats) * 100;
};

export const shouldHideCapacity = (location: string): boolean => {
  return location === "Mecca Mall - SmartTech";
};
