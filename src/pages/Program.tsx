import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getProgram } from '../data/programs'

export default function Program() {
  const { programId } = useParams()
  const navigate = useNavigate()
  const program = getProgram(programId)

  if (!program) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <p className="text-[15px] font-light text-[#B5B2AA]">Program not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] pb-nav apex-page">
      {/* Header */}
      <div className="px-6 pt-14 pb-7">
        <button
          onClick={() => navigate('/programs')}
          className="flex items-center gap-1.5 text-[#B5B2AA] text-[11px] font-medium uppercase tracking-[0.14em] mb-5"
        >
          <ArrowLeft size={14} />
          {program.name.toLowerCase()}
        </button>

        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#B5B2AA] mb-2">
          training program
        </p>
        <h1 className="text-[44px] font-extralight lowercase tracking-[0.01em] leading-[1.05] text-[#0F0F0E]">
          {program.name.toLowerCase()}
        </h1>
        <p className="text-[13px] font-extralight text-[#636158] lowercase mt-2">
          {program.edition ?? (program.author ? `by ${program.author}` : '')}
        </p>
      </div>

      {/* Phases list */}
      <div className="px-6 apex-stagger">
        {program.phases.map((phase, i) => (
          <button
            key={phase.id}
            onClick={() => navigate(`/program/${program.id}/${phase.id}`)}
            className="w-full text-left py-5 flex items-center gap-4 border-b-[0.5px] border-[#E5E3DD]"
          >
            {/* Large index number */}
            <span className="text-[52px] font-extralight leading-none tabular-nums text-[#E5E3DD] flex-shrink-0 w-14 text-center">
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Phase info */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#636158] mb-1">
                {program.phases.length > 1 ? `phase ${i + 1}` : 'cycle'}
              </p>
              <p className="text-[18px] font-light text-[#0F0F0E] lowercase leading-snug">
                {phase.name}
              </p>
              <p className="text-[13px] font-light text-[#636158] mt-0.5">
                {phase.weeks
                  ? `Weeks ${phase.weeks[0]}–${phase.weeks[phase.weeks.length - 1]} · ${phase.days.length} days`
                  : `${phase.days.length} days · repeats weekly`}
              </p>
            </div>

            <ArrowRight size={14} className="text-[#B5B2AA] flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}
