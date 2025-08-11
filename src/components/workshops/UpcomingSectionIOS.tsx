import React from 'react';
export type Day = { key:string; label:string; date:string; count:number; active:boolean };
export type Category = { id:string; name:string; icon?:React.ReactNode; active:boolean };
export type Session = { id:string; title:string; instructor:string; timeLabel:string; capacity:number; spots_available:number; past?:boolean };
export default function UpcomingSectionIOS(props:{
  weekLabel:string; weekDays:Day[]; level:string; categories:Category[];
  onPrevWeek:()=>void; onNextWeek:()=>void; onToday:()=>void; onOpenCalendar:()=>void; onSearch:(e:React.ChangeEvent<HTMLInputElement>)=>void; onLevel:(l:string)=>void; onToggleCat:(id:string)=>void; onResetFilters:()=>void; onSelectDay:(d:string)=>void;
  days: Array<{ key:string; header:string; sessions:Session[] }>;
  onRegister:(s:Session)=>void;
}){
  const {weekLabel,weekDays,level,categories,onPrevWeek,onNextWeek,onToday,onOpenCalendar,onSearch,onLevel,onToggleCat,onResetFilters,onSelectDay,days,onRegister}=props;
  return (
    <section className='ios-up ios-only'>
      <header className='ios-hd'>
        <h2 className='ios-h2'>Available Workshops</h2>
        <p className='ios-sub'>Pick a week, filter, then choose your seat.</p>
      </header>
      <div className='ios-bar'>
        <div className='ios-row'>
          <div className='ios-seg' role='group' aria-label='Week'>
            <button onClick={onPrevWeek}>‹ Week</button>
            <button aria-pressed={true} onClick={onToday}>Today</button>
            <button onClick={onNextWeek}>Week ›</button>
          </div>
          <span className='ios-sub ios-week' style={{marginLeft:8}}>{weekLabel}</span>
        </div>
        <div className='ios-row'>
          <button className='ios-pill' onClick={onOpenCalendar}>📅 Pick a date</button>
          <input className='ios-input' inputMode='search' placeholder='Search workshops' onChange={onSearch} />
        </div>
        <div className='ios-scroll' aria-label='Level'>
          {['All','Beginner','Intermediate','Advanced'].map(l=> (
            <button key={l} className='ios-chip' data-active={level===l} onClick={()=>onLevel(l)}>{l}</button>
          ))}
        </div>
        <div className='ios-scroll' aria-label='Category'>
          {categories.map(c=> (
            <button key={c.id} className='ios-chip' data-active={c.active} onClick={()=>onToggleCat(c.id)}>{c.icon} {c.name}</button>
          ))}
          <button className='ios-chip' onClick={onResetFilters}>Reset</button>
        </div>
        <div className='ios-scroll' aria-label='Days'>
          {weekDays.map(d=> (
            <button key={d.key} className='ios-chip' data-active={d.active} onClick={()=>onSelectDay(d.date)}>{d.label}{d.count? ` · ${d.count}`: ''}</button>
          ))}
        </div>
      </div>
      <div>
        {days.map(day=> (
          <section key={day.key} id={`day-${day.key}`}>
            <h3 className='ios-day'>{day.header}</h3>
            <div className='ios-list'>
              {day.sessions.map(s=>{
                const pct = s.capacity>0 ? Math.round(100*(s.capacity - s.spots_available)/s.capacity) : 0;
                const state = s.spots_available<=0? 'ios-full' : s.past? 'ios-past' : '';
                return (
                  <article key={s.id} className={`ios-w ${state}`}>
                    <h3>{s.title}</h3>
                    <div className='ios-meta'>
                      <span>👤 Instructor: {s.instructor}</span>
                    </div>
                    <div className='ios-meter'><i style={{width:`${pct}%`}}/></div>
                    <div className='ios-foot'>
                      <div className='ios-meta'>🕒 {s.timeLabel}</div>
                      <button className='ios-btn ios-primary' disabled={s.spots_available<=0||s.past} onClick={()=>onRegister(s)}>{s.spots_available<=0? 'Full' : 'Register'}</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
