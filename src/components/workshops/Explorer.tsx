import React from 'react';

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
          <button className="wx-pill" onClick={onOpenCalendar}>📅 Pick date</button>
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
