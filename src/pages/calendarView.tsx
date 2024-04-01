import { useState, useEffect } from "react"
import { format, parseISO, subMonths } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "shadcn/components/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "shadcn/components/dialog"
import { Badge } from "shadcn/components/badge.tsx"

import "react-day-picker/dist/style.css"
import { TooltipArrow } from "@radix-ui/react-tooltip"
import { fr } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import { cn } from "../../shadcn/lib.ts"
import { Button, buttonVariants } from "shadcn/components/button.tsx"
import { Card } from "shadcn/components/card.tsx"
import { Separator } from "shadcn/components/separator.tsx"
import { useNavigate } from "react-router-dom"

type DayData = {
  date: string;
  rate: number;
  short_summary: string;
  tags: string[];
};

function CalendarView() {
  const [dailyData, setDailyData] = useState<DayData[]>()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedDay, setSelectedDay] = useState<DayData>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const navigate = useNavigate()

  // Simuler l'obtention des données du backend
  useEffect(() => {
    const data: DayData[] = [
      {
        date: "2024-03-20",
        rate: 8.5,
        short_summary: "Une journée ensoleillée à la plage avec des amis.",
        tags: ["plage", "soleil", "amis"]
      },
      {
        date: "2024-03-21",
        rate: 4.5,
        short_summary: "Exploration d'une nouvelle ville et découverte de ses trésors cachés.",
        tags: ["voyage", "exploration", "nouvelle ville"]
      },
      {
        date: "2024-03-22",
        rate: 7.5,
        short_summary: "Randonnée en montagne avec vue panoramique sur la vallée.",
        tags: ["randonnée", "montagne", "nature"]
      },
      {
        date: "2024-03-23",
        rate: 8.5,
        short_summary: "Une journée de détente au spa avec massage et soins de la peau.",
        tags: ["spa", "détente", "massage"]
      },
      {
        date: "2024-03-24",
        rate: 5.5,
        short_summary: "Découverte d'une nouvelle cuisine ethnique avec des plats épicés et exotiques.",
        tags: ["cuisine", "nouvelle expérience", "épicé"]
      },
      {
        date: "2024-03-25",
        rate: 1.5,
        short_summary: "Une journée pluvieuse à la maison avec des films et des snacks.",
        tags: ["pluie", "films", "détente"]
      },
      {
        date: "2024-03-26",
        rate: 9.5,
        short_summary: "Une journée de bénévolat dans un refuge animalier, avec beaucoup de câlins de chiots.",
        tags: ["bénévolat", "animaux", "chiots"]
      }
    ]

    setDailyData(data)
  }, [])

  const getDayColor = (rate: number) => {
    if (rate === -1) return "hsl(0, 0%, 100%)" // Blanc pour les jours sans note (null)
    // Calculer la teinte en fonction de la note (0-10)
    const hue = 120 * (rate / 10) // Calcul de la teinte de 0 à 120 (rouge à vert)
    return `hsl(${hue}, 100%, 85%, 60%)` // Saturation et luminosité fixes
  }

  const getDayTextColor = (rate: number) => {
    if (rate === -1) return "hsl(0, 0%, 100%)"
    const hue = 120 * (rate / 10)
    return `hsl(${hue}, 100%, 30%)`
  }

  const getDayStyle = (rate: number) => {
    const backgroundColor = getDayColor(rate)
    const color = getDayTextColor(rate)
    return {
      borderColor: color,
      borderWidth: "2px",
      borderStyle: "solid",
      backgroundColor: backgroundColor
    }
  }

  const zeroRateDays = dailyData?.filter(d => d.rate < 1)?.map(d => new Date(d.date)) ?? []
  const oneRateDays = dailyData?.filter(d => d.rate < 2 && d.rate >= 1)?.map(d => new Date(d.date)) ?? []
  const twoRateDays = dailyData?.filter(d => d.rate < 3 && d.rate >= 2)?.map(d => new Date(d.date)) ?? []
  const threeRateDays = dailyData?.filter(d => d.rate < 4 && d.rate >= 3)?.map(d => new Date(d.date)) ?? []
  const fourRateDays = dailyData?.filter(d => d.rate < 5 && d.rate >= 4)?.map(d => new Date(d.date)) ?? []
  const fiveRateDays = dailyData?.filter(d => d.rate < 6 && d.rate >= 5)?.map(d => new Date(d.date)) ?? []
  const sixRateDays = dailyData?.filter(d => d.rate < 7 && d.rate >= 6)?.map(d => new Date(d.date)) ?? []
  const sevenRateDays = dailyData?.filter(d => d.rate < 8 && d.rate >= 7)?.map(d => new Date(d.date)) ?? []
  const eightRateDays = dailyData?.filter(d => d.rate < 9 && d.rate >= 8)?.map(d => new Date(d.date)) ?? []
  const nineRateDays = dailyData?.filter(d => d.rate < 10 && d.rate >= 9)?.map(d => new Date(d.date)) ?? []
  const tenRateDays = dailyData?.filter(d => d.rate === 10)?.map(d => new Date(d.date)) ?? []

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

  const handleDayClick = () => {
    setIsDialogOpen(true)
  }

  const handleDayMouseEnter = (date: Date) => {
    setSelectedDate(date)
    const dayData = dailyData?.find(d => format(new Date(d.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
    if (dayData) {
      setSelectedDay(dayData)
    } else {
      setSelectedDay(undefined)
    }
  }

  const handleCloseClick = () => {
    setIsDialogOpen(false)
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90%" }}>
      <div className="flex justify-center items-center">
        <Dialog open={isDialogOpen} onOpenChange={handleCloseClick}>
          <Card>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <DayPicker
                    showOutsideDays={true}
                    defaultMonth={subMonths(new Date(), 1)}
                    style={{
                      "--rdp-cell-size": "90px",
                      "--rdp-caption-font-size": "30px",
                      "--rdp-background-color": "#f3f4f6",
                      "fontSize": "22px"
                    }}
                    classNames={{
                      nav_button: cn(
                        buttonVariants({ variant: "outline" }),
                        "h-10 w-10"
                      ),
                      day: cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-16 w-16 active:font-bold hover:font-bold"
                      )
                    }}
                    locale={fr}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    numberOfMonths={2}
                    onDayClick={handleDayClick}
                    onDayMouseEnter={handleDayMouseEnter}
                    onDayMouseLeave={() => setSelectedDate(undefined)}
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
                {selectedDate && (
                  <TooltipContent side="bottom" align="center"
                                  style={{
                                    borderColor: getDayTextColor(selectedDay?.rate || -1),
                                    backgroundColor: getDayColor(selectedDay?.rate || -1),
                                    fontSize: "x-large",
                                    padding: 15
                                  }}>
                    {format(selectedDate, "EEEE d MMMM", { locale: fr }).charAt(0).toUpperCase() + format(selectedDate, "EEEE d MMMM", { locale: fr }).slice(1)} {selectedDay !== undefined ? <>: <b
                    style={{ color: getDayTextColor(selectedDay?.rate || -1) }}>{selectedDay?.rate || -1}/10</b></> : ""}
                    <TooltipArrow />
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </Card>
          <DialogContent style={{ borderWidth: "3px", borderColor: getDayColor(selectedDay?.rate || -1) }}
                         onInteractOutside={handleCloseClick}
                         onEscapeKeyDown={handleCloseClick}>
            {selectedDay?.date !== undefined ? (
              <>
                <DialogHeader>
                  <DialogTitle>Résumé de la journée</DialogTitle>
                  <DialogDescription>Voici votre résumé de la journée
                    du {format(parseISO(selectedDay?.date || ""), "EEEE d MMMM yyyy", { locale: fr })}</DialogDescription>
                </DialogHeader>
                <div className={"flex justify-start flex-col "}>
                  <div className="flex justify-between items-center px-4 py-3">
                    <div className="flex space-x-2">
                      {selectedDay?.tags.map((tag, index) => {
                        const hue = Math.floor(Math.random() * 361)
                        const backgroundColor = `hsl(${hue}, 80%, 80%)`
                        const textColor = `hsl(${hue}, 100%, 20%)`
                        return (
                          <Badge key={index} style={{
                            backgroundColor,
                            color: textColor,
                            fontSize: "medium",
                            padding: "4px 10px"
                          }}>{tag}</Badge>
                        )
                      })}
                    </div>
                    <Separator orientation="vertical" />
                    <div style={{
                      color: getDayTextColor(selectedDay?.rate),
                      fontWeight: "bold",
                      fontSize: "large"
                    }}>{selectedDay?.rate}/10
                    </div>
                  </div>
                  <Separator className="my-4" />
                  {selectedDay?.short_summary}
                </div>
                <DialogFooter>
                  <Button variant={"secondary"} onClick={handleCloseClick}>Fermer</Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Pas d'information</DialogTitle>
                  <DialogDescription>Vous n'avez pas encore renseigné d'information pour
                    aujourd'hui.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant={"default"} onClick={() => navigate("/dailyNote")}>Aller à la page dailyNote</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default CalendarView