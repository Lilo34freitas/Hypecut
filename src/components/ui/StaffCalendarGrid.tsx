import React from 'react';
import { Edit2 } from 'lucide-react';

export interface StaffCalendarGridProps {
  appointments: any[];
  professionals: any[];
  onSelectAppointment: (appt: any) => void;
}

export const StaffCalendarGrid: React.FC<StaffCalendarGridProps> = ({
  appointments,
  professionals,
  onSelectAppointment,
}) => {
  // Generate hours from 08:00 to 21:00
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);

  return (
    <div className="bg-black border border-white/10 overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Header Row: Professionals */}
        <div className="grid grid-cols-[100px_repeat(6,1fr)] bg-white/5 border-b border-white/10 font-black text-xs uppercase text-[#F2EAD9]">
          <div className="p-3 border-r border-white/10 text-center text-white/50 text-[10px]">
            HORA
          </div>
          {professionals.map((pro) => (
            <div key={pro.id} className="p-3 border-r border-white/10 text-center flex flex-col items-center">
              <span className="text-[10px] text-[#5E308A] uppercase tracking-widest">{pro.role}</span>
              <span className="font-black text-xs text-[#F2EAD9] truncate max-w-[120px]">{pro.name}</span>
            </div>
          ))}
        </div>

        {/* Time Rows */}
        {hours.map((hour) => {
          const hourLabel = `${String(hour).padStart(2, '0')}:00`;

          return (
            <div
              key={hour}
              className="grid grid-cols-[100px_repeat(6,1fr)] border-b border-white/10 min-h-[64px]"
            >
              {/* Hour Label */}
              <div className="p-3 border-r border-white/10 text-xs font-black text-white/40 flex items-center justify-center bg-black">
                {hourLabel}
              </div>

              {/* Column for each Professional */}
              {professionals.map((pro) => {
                const matchingAppts = appointments.filter((a) => {
                  const apptDate = new Date(a.startTime);
                  const apptHour = apptDate.getHours();
                  const proNameTarget = (pro.name || '').trim().toLowerCase();
                  const apptProName = (a.professional?.name || '').trim().toLowerCase();
                  const isSamePro = a.professionalId === pro.id || (proNameTarget && apptProName && proNameTarget === apptProName);
                  return isSamePro && apptHour === hour;
                });

                return (
                  <div
                    key={pro.id}
                    className="p-1 border-r border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative min-h-[64px]"
                  >
                    {matchingAppts.map((appt) => {
                      const timeStr = new Date(appt.startTime).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <div
                          key={appt.id}
                          onClick={() => onSelectAppointment(appt)}
                          className={`p-2 border cursor-pointer transition-all hover:scale-[1.02] shadow-md space-y-1 mb-1 ${
                            appt.status === 'CONFIRMED'
                              ? 'bg-[#5E308A]/30 border-[#5E308A] text-white'
                              : appt.status === 'COMPLETED'
                              ? 'bg-green-950/60 border-green-600 text-green-200'
                              : 'bg-red-950/50 border-red-700 text-red-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 text-[10px] font-black">
                            <span className="text-[#E0AAFF]">{timeStr}</span>
                            <Edit2 size={10} className="opacity-60" />
                          </div>
                          <div className="font-black text-xs truncate text-[#F2EAD9]">
                            {appt.clientName}
                          </div>
                          <div className="text-[9px] font-bold opacity-80 truncate">
                            {appt.service?.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
