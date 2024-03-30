import { useState, useEffect } from "react"
import { format, isValid } from "date-fns"
import { Button } from "shadcn/components/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "shadcn/components/tooltip"
import { Calendar } from "shadcn/components/calendar"

function CalendarView() {
  const [dailyData, setDailyData] = useState([{ date: "", rate: 0, short_summary: "", tags: [""] }])
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedDayNote, setSelectedDayNote] = useState(null)

  // Simuler l'obtention des données du backend
  useEffect(() => {
    const data = [
      {
        date: "2024-03-20",
        rate: 8.5,
        short_summary: "Cours, shopping, repas délicieux, aide à monter un PC et repas de magret de canard offert en échange.",
        tags: ["cours", "shopping", "repas", "amis", "pc", "magret de canard"]
      },
      {
        date: "2024-03-21",
        rate: 4.5,
        short_summary: "Cours, shopping, repas délicieux, aide à monter un PC et repas de magret de canard offert en échange.",
        tags: ["cours", "shopping", "repas", "amis", "pc", "magret de canard"]
      },
      {
        date: "2024-03-22",
        rate: 7.5,
        short_summary: "Cours, shopping, repas délicieux, aide à monter un PC et repas de magret de canard offert en échange.",
        tags: ["cours", "shopping", "repas", "amis", "pc", "magret de canard"]
      },
      {
        date: "2024-03-23",
        rate: 8.5,
        short_summary: "Cours, shopping, repas délicieux, aide à monter un PC et repas de magret de canard offert en échange.",
        tags: ["cours", "shopping", "repas", "amis", "pc", "magret de canard"]
      },
      {
        date: "2024-03-24",
        rate: 5.5,
        short_summary: "Cours, shopping, repas délicieux, aide à monter un PC et repas de magret de canard offert en échange.",
        tags: ["cours", "shopping", "repas", "amis", "pc", "magret de canard"]
      },
      {
        date: "2024-03-25",
        rate: 1.5,
        short_summary: "Cours, shopping, repas délicieux, aide à monter un PC et repas de magret de canard offert en échange.",
        tags: ["cours", "shopping", "repas", "amis", "pc", "magret de canard"]
      },
      {
        date: "2024-03-26",
        rate: 9.5,
        short_summary: "Cours, shopping, repas délicieux, aide à monter un PC et repas de magret de canard offert en échange.",
        tags: ["cours", "shopping", "repas", "amis", "pc", "magret de canard"]
      }
    ]
    setDailyData(data)
  }, [])

  const getDayColor = (rate: number) => {
    // Calculer la teinte en fonction de la note (0-10), mais en inversant la relation
    const hue = 120 * (rate / 10) // Calcul de la teinte de 0 à 120 (rouge à vert)
    return `hsl(${hue}, 100%, 85%, 60%)` // Saturation et luminosité fixes
  }

  const getDayStyle = (rate: number) => {
    const color = getDayColor(rate)
    return { borderColor: color, borderWidth: "2px", borderStyle: "solid", backgroundColor: color }
  }

  const zeroRateDays = dailyData.filter(d => d.rate < 1).map(d => new Date(d.date))
  const oneRateDays = dailyData.filter(d => d.rate < 2 && d.rate >= 1).map(d => new Date(d.date))
  const twoRateDays = dailyData.filter(d => d.rate < 3 && d.rate >= 2).map(d => new Date(d.date))
  const threeRateDays = dailyData.filter(d => d.rate < 4 && d.rate >= 3).map(d => new Date(d.date))
  const fourRateDays = dailyData.filter(d => d.rate < 5 && d.rate >= 4).map(d => new Date(d.date))
  const fiveRateDays = dailyData.filter(d => d.rate < 6 && d.rate >= 5).map(d => new Date(d.date))
  const sixRateDays = dailyData.filter(d => d.rate < 7 && d.rate >= 6).map(d => new Date(d.date))
  const sevenRateDays = dailyData.filter(d => d.rate < 8 && d.rate >= 7).map(d => new Date(d.date))
  const eightRateDays = dailyData.filter(d => d.rate < 9 && d.rate >= 8).map(d => new Date(d.date))
  const nineRateDays = dailyData.filter(d => d.rate < 10 && d.rate >= 9).map(d => new Date(d.date))
  const tenRateDays = dailyData.filter(d => d.rate === 10).map(d => new Date(d.date))

  const zeroRateStyle = getDayStyle(0)
  const oneRateStyle = getDayStyle(1)
  const twoRateStyle = getDayStyle(2)
  const threeRateStyle = getDayStyle(3)
  const fourRateStyle = getDayStyle(4)
  const fiveRateStyle = getDayStyle(5)
  const sixRateStyle = getDayStyle(6)
  const sevenRateStyle = getDayStyle(7)
  const eightRateStyle = getDayStyle(8)
  const nineRateStyle = getDayStyle(9)
  const tenRateStyle = getDayStyle(10)

  const handleDayClick = (date) => {
    setSelectedDay(date)
    const dayData = dailyData.find(d => format(new Date(d.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
    if (dayData) {
      setSelectedDayNote(dayData.rate)
    }
  }

  return (
    <div className="flex justify-center items-center mt-40">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Calendar
              onDayClick={handleDayClick}
              modifiers={{
                rate_0: zeroRateDays,
                rate_1: oneRateDays,
                rate_2: twoRateDays,
                rate_3: threeRateDays,
                rate_4: fourRateDays,
                rate_5: fiveRateDays,
                rate_6: sixRateDays,
                rate_7: sevenRateDays,
                rate_8: eightRateDays,
                rate_9: nineRateDays,
                rate_10: tenRateDays
              }}
              modifiersStyles={{
                rate_0: zeroRateStyle,
                rate_1: oneRateStyle,
                rate_2: twoRateStyle,
                rate_3: threeRateStyle,
                rate_4: fourRateStyle,
                rate_5: fiveRateStyle,
                rate_6: sixRateStyle,
                rate_7: sevenRateStyle,
                rate_8: eightRateStyle,
                rate_9: nineRateStyle,
                rate_10: tenRateStyle
              }}
            />
          </TooltipTrigger>
          {selectedDay && (
            <TooltipContent>
              Day: {format(selectedDay, "d")} - Note: {selectedDayNote}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default CalendarView