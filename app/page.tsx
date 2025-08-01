"use client"
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

type CommitmentDetails = {
  Borrowers: string[]
  Guarantors: string[]
  Principal: number
  Cocharge: number | null
  Term: number
  IR: number
  Prime_Plus_Rate: number
  Extension_IR: number
  Extension_Prime_Plus_Rate: number
  Date: string
  Closing_Date: string
  Offer_End_Date: string
  Assignment: string
  Signature_Fields: number
  Cost_Details: { label: string; value: number }[]
  Security_Details: string[]
  Retainer: number
  Conditions: string
  AFM_ID: string
  Co_Lender: string | null
}

const options = {
  method: "GET",
  headers: {
    "xc-token": process.env.NEXT_PUBLIC_XC_TOKEN!,
  },
}

export default function Home() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [commitmentDetails, setCommitmentDetails] = useState<CommitmentDetails>()

  const baseUrl = "https://mortgages.aartiinc.com/api/v2"
  const dealsTableId = "mwr1m6nrf989s82"
  const coLendersTableId = "mbmb8cwo89brxq1"

  const linkMap = {
    Borrowers: "cjlkbox4nz3u42p",
    Guarantors: "cauf2ej8t32wjy4",
    Cost_Details: "c1dzgydnu1svs0b",
    Security_Details: "c10bp1rk45xh0l8",
  }

  async function fetchLinkField(linkFieldId: string, recordId: string) {
    const res = await fetch(
      `${baseUrl}/tables/${dealsTableId}/links/${linkFieldId}/records/${recordId}?limit=100&offset=0`,
      options
    )
    const json = await res.json()
    return json?.list || []
  }

  async function fetchCostValues(recordId: string) {
    const res = await fetch(
      `${baseUrl}/tables/${dealsTableId}/links/${linkMap.Cost_Details}/records/${recordId}?fields=Cost_Value&limit=100&offset=0`,
      options
    )
    const json = await res.json()
    return json?.list?.map((item: any) => item.Cost_Value) || []
  }

  async function fetchCoLenderName(coLenderId: string | null): Promise<string | null> {
    if (!coLenderId) return null

    try {
      const res = await fetch(`${baseUrl}/tables/${coLendersTableId}/records/${coLenderId}`, options)
      if (!res.ok) {
        console.warn("Failed to fetch co-lender. Status:", res.status)
        return null
      }
      const json = await res.json()
      return json?.Name || null
    } catch (err) {
      console.error("Error fetching co-lender:", err)
      return null
    }
  }

  async function fetchData(recordId: string | null) {
    if (!recordId) return

    try {
      const dealRes = await fetch(`${baseUrl}/tables/${dealsTableId}/records/${recordId}`, options)
      const deal = await dealRes.json()

      const coLenderId = deal?.Co_Lenders_id || null
      console.log("Resolved Co_Lenders_id:", coLenderId)

      const [
        borrowers,
        guarantors,
        costDetailLabels,
        costValues,
        securityDetails,
        coLenderName,
      ] = await Promise.all([
        fetchLinkField(linkMap.Borrowers, recordId),
        fetchLinkField(linkMap.Guarantors, recordId),
        fetchLinkField(linkMap.Cost_Details, recordId),
        fetchCostValues(recordId),
        fetchLinkField(linkMap.Security_Details, recordId),
        fetchCoLenderName(coLenderId),
      ])

      const costDetails = costDetailLabels.map((c: any, idx: number) => ({
        label: c.Cost_Detail,
        value: costValues[idx] || 0,
      }))

      setCommitmentDetails({
        Borrowers: borrowers.map((b: any) => b.Name),
        Guarantors: guarantors.map((g: any) => g.Name),
        Principal: deal.Principal,
        Cocharge: deal.Cocharge,
        Term: deal.Term,
        IR: deal.Interest_Rate,
        Prime_Plus_Rate: deal.Prime_Plus_Rate,
        Extension_IR: deal.Extension_IR,
        Extension_Prime_Plus_Rate: deal.Extension_Prime_Plus_Rate,
        Date: deal.Date,
        Closing_Date: deal.Closing_Date,
        Offer_End_Date: deal.Offer_End_Date,
        Assignment: deal.Assignment,
        Signature_Fields: deal.Signature_Fields,
        Cost_Details: costDetails,
        Security_Details: securityDetails.map((s: any) => s.Name),
        Retainer: deal.Retainer,
        Conditions: deal.Conditions || "",
        AFM_ID: deal.AFM_ID,
        Co_Lender: coLenderName,
      })
    } catch (error) {
      console.error("Failed to fetch commitment details:", error)
    }
  }

  useEffect(() => {
    fetchData(id)
  }, [])

  if (!commitmentDetails) {
    return <div>Loading commitment details...</div>
  }

  return (
    <div>
      <PDFViewer className="w-full h-screen">
        <Pdf
          borrowers={commitmentDetails.Borrowers}
          guarantors={commitmentDetails.Guarantors}
          principalAmount={commitmentDetails.Principal}
          term={commitmentDetails.Term}
          cocharge={commitmentDetails.Cocharge}
          ir={commitmentDetails.IR}
          ppr={commitmentDetails.Prime_Plus_Rate}
          ptir={commitmentDetails.Extension_IR}
          ptppr={commitmentDetails.Extension_Prime_Plus_Rate}
          date={commitmentDetails.Date}
          closingDate={commitmentDetails.Closing_Date}
          offerEndDate={commitmentDetails.Offer_End_Date}
          mortgageAssignment={commitmentDetails.Assignment}
          sigFields={commitmentDetails.Signature_Fields}
          costDetails={commitmentDetails.Cost_Details}
          securityDetails={commitmentDetails.Security_Details}
          retainer={commitmentDetails.Retainer}
          conditions={commitmentDetails.Conditions}
          coLender={commitmentDetails.Co_Lender}
        />
      </PDFViewer>
    </div>
  )
}
