"use client"
type CommitmentDetails = {
  Borrowers: string[]
  Guarantors: string[]
  Principal: number
  Term: number
  IR: number
  Prime_Plus_Rate: number
  Extension_IR: number
  Extension_Prime_Plus_Rate: number
  Date: string
  Closing_Date: string
  Offer_End_Date: string
  Assignment: string
  Cost_Details: { label: string; value: number }[]
  Security_Details: string[]
  Retainer: number
  Conditions: string
  AFM_ID: string
}

import React, { useEffect, useState } from "react"
import Pdf from "./pdf"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
)

const options = {
  method: "GET",
  headers: {
    "xc-token": process.env.NEXT_PUBLIC_XC_TOKEN,
  },
}

export default function Home() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [commitmentDetails, setCommitmentDetails] = useState<CommitmentDetails>()

  const baseUrl = "https://mortgages.aartiinc.com/api/v2"
  const tableId = "mwr1m6nrf989s82"

  const linkMap = {
    Borrowers: "cjlkbox4nz3u42p",
    Guarantors: "cauf2ej8t32wjy4",
    Cost_Details: "c1dzgydnu1svs0b",
    Security_Details: "c10bp1rk45xh0l8"
  }

  async function fetchLinkField(linkFieldId: string, recordId: string) {
    const res = await fetch(
      `${baseUrl}/tables/${tableId}/links/${linkFieldId}/records/${recordId}?limit=100&offset=0`,
      options
    )
    const json = await res.json()
    return json?.list || []
  }

  async function fetchCostValues(recordId: string) {
    const res = await fetch(
      `${baseUrl}/tables/${tableId}/links/${linkMap.Cost_Details}/records/${recordId}?fields=Cost_Value&limit=100&offset=0`,
      options
    )
    const json = await res.json()
    return json?.list?.map((item: any) => item.Cost_Value) || []
  }

  async function fetchData(recordId: string | null) {
    if (!recordId) return

    const deal = await fetch(`${baseUrl}/tables/${tableId}/records/${recordId}`, options).then(res => res.json())

    const [borrowers, guarantors, costDetailLabels, costValues, securityDetails] = await Promise.all([
      fetchLinkField(linkMap.Borrowers, recordId),
      fetchLinkField(linkMap.Guarantors, recordId),
      fetchLinkField(linkMap.Cost_Details, recordId),
      fetchCostValues(recordId),
      fetchLinkField(linkMap.Security_Details, recordId),
    ])

    const costDetails = costDetailLabels.map((c: any, idx: number) => ({
      label: c.Cost_Detail,
      value: costValues[idx] || 0,
    }))

    setCommitmentDetails({
      Borrowers: borrowers.map((b: any) => b.Name),
      Guarantors: guarantors.map((g: any) => g.Name),
      Principal: deal.Principal,
      Term: deal.Term,
      IR: deal.IR,
      Prime_Plus_Rate: deal.Prime_Plus_Rate,
      Extension_IR: deal.Extension_IR,
      Extension_Prime_Plus_Rate: deal.Extension_Prime_Plus_Rate,
      Date: deal.Date,
      Closing_Date: deal.Closing_Date,
      Offer_End_Date: deal.Offer_End_Date,
      Assignment: deal.Assignment,
      Cost_Details: costDetails,
      Security_Details: securityDetails.map((s: any) => s.Name),
      Retainer: deal.Retainer,
      Conditions: deal.Conditions || "",
      AFM_ID: deal.AFM_ID,
    })
  }

  useEffect(() => {
    fetchData(id)
  }, [])

  if (!commitmentDetails) {
    return <div>Loading commitment details...</div>
  } else {
    return (
      <div>
        <PDFViewer className="w-full h-screen">
          <Pdf
            borrowers={commitmentDetails.Borrowers}
            guarantors={commitmentDetails.Guarantors}
            principalAmount={commitmentDetails.Principal}
            term={commitmentDetails.Term}
            ir={commitmentDetails.IR}
            ppr={commitmentDetails.Prime_Plus_Rate}
            ptir={commitmentDetails.Extension_IR}
            ptppr={commitmentDetails.Extension_Prime_Plus_Rate}
            date={commitmentDetails.Date}
            closingDate={commitmentDetails.Closing_Date}
            offerEndDate={commitmentDetails.Offer_End_Date}
            mortgageAssignment={commitmentDetails.Assignment}
            costDetails={commitmentDetails.Cost_Details}
            securityDetails={commitmentDetails.Security_Details}
            retainer={commitmentDetails.Retainer}
            conditions={commitmentDetails.Conditions}
          />
        </PDFViewer>
      </div>
    )
  }
}
