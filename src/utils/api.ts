export type JournalEntry = {
  date: Date
  rate: number
  short_summary: string
  tags: string[]
}

export async function createJournalEntry(name: string, summary: string, date: Date) {
  try {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // Adding 1 because getMonth() returns 0-based index
    const day = date.getDate()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return (await fetch(import.meta.env.VITE_API, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        summary,
        date: `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`
      }),
    }).then((r) => r.json())) as JournalEntry
  } catch (e: unknown) {
    console.error(e)
  }
}

export async function listJournalEntries() {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return (await fetch(import.meta.env.VITE_API, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((r) => r.json())) as JournalEntry[]
  } catch (e: unknown) {
    console.error(e)
  }
}

export async function deleteDay(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // Adding 1 because getMonth() returns 0-based index
  const day = date.getDate()

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return await fetch(import.meta.env.VITE_API, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        date: `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`,
      }),
    })
  } catch (e: unknown) {
    console.error(e)
  }
}
