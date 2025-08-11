import React from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type Day = { key:string; label:string; date:string; count:number; active:boolean };
export type Category = { id:string; name:string; icon?:React.ReactNode; active:boolean };

export default function Explorer(props:{
  weekLabel:string; weekDays:Day[]; level:string; categories:Category[];
  onPrevWeek:()=>void; onNextWeek:()=>void; onToday:()=>void; onOpenCalendar:()=>void;
  onSearch:(e:React.ChangeEvent<HTMLInputElement>)=>void; onLevel:(l:string)=>void;
  onToggleCat:(id:string)=>void; onResetFilters:()=>void; onSelectDay:(d:string)=>void;
  children?:React.ReactNode;
}){
  const {weekLabel, weekDays, level, categories, onPrevWeek, onNextWeek, onToday, onOpenCalendar, onSearch, onLevel, onToggleCat, onResetFilters, onSelectDay, children} = props;
  const [date, setDate] = React.useState<Date>();
  return (
    <section className="wx-shell" aria-label="Workshops explorer">
      <header className="wx-head">
        <h2 className="wx-title">Available Workshops</h2>
        <p className="wx-sub">Pick a week, filter, then choose your seat.</p>
      </header>
      <div className="wx-toolbar">
        <div className="wx-row">
          <div className="wx-seg" role="group" aria-label="Week">
            <button aria-pressed="false" onClick={onPrevWeek}>‹ Week</button>
            <button aria-pressed="false" onClick={onToday}>Today</button>
            <button aria-pressed="false" onClick={onNextWeek}>Week ›</button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="wx-pill wx-date" aria-label="Pick a date">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => { setDate(d); if (d) { onSelectDay(format(d, "yyyy-MM-dd")); } }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <div className="grow"/>
          <input className="wx-input" placeholder="Search workshops" onChange={onSearch} aria-label="Search workshops" />
        </div>
        <div className="wx-row" style={{marginTop:10}}>
          <div className="wx-seg" role="group" aria-label="Skill level">
            {['All','Beginner','Intermediate','Advanced'].map(l=> (
              <button key={l} aria-pressed={level===l} onClick={()=>onLevel(l)}>{l}</button>
            ))}
          </div>
          <div className="wx-pills" role="group" aria-label="Categories">
            {categories.map(c => (
              <button key={c.id} className="wx-pill" data-active={c.active} onClick={()=>onToggleCat(c.id)}>{c.icon} {c.name}</button>
            ))}
            <button className="wx-pill" onClick={onResetFilters}>Reset</button>
          </div>
        </div>
      </div>
      <div className="wx-content">{children}</div>
    </section>
  );
}
