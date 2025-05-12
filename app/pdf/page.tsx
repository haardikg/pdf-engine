"use client"
import React, { useEffect } from "react"
import Pdf from "../pdf"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
)

import { PDFDownloadLink } from "@react-pdf/renderer"

export default function Home() {
  const searchParams = useSearchParams()
  useEffect(() => {
    console.log(searchParams.get("borrowers").slice(0,-2).split("*,"))
    console.log(searchParams.get("guarantors").slice(0,-2).split("*,"))
  }, [])
  return (
    <div>
      <PDFViewer className="w-1/2 h-screen">
        <Pdf
          date={searchParams.get("date") as string}
          borrowers={searchParams.get("borrowers").slice(0,-2).split("*,")}
          guarantors={searchParams.get("guarantors").slice(0,-2).split("*,")}
          principalAmount={searchParams.get("principalAmount")}
          term={searchParams.get("term")}
          ir={searchParams.get("ir")}
          ppr={searchParams.get("ppr")}
          ptir={searchParams.get("ptir")}
          ptppr={searchParams.get("ptppr")}
          closingDate={searchParams.get("closingDate") as string}
          mortgageAssignment={searchParams.get("mortgageAssignment")}
          securityDetails={(searchParams.get("securityDetails") + ",").split(
            "*,"
          )}
          offerEndDate={searchParams.get("offerEndDate") as string}
          retainer={searchParams.get("retainer")}
          conditions={JSON.parse(searchParams.get("conditions"))}
          costDetails={JSON.parse(searchParams.get("costDetails"))}
        />
      </PDFViewer>
    </div>
  )
}
