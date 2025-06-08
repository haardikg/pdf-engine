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

const options = {
  method: "GET",
  headers: {
    "xc-token": process.env.NEXT_PUBLIC_XC_TOKEN,
  },
}

import { PDFDownloadLink, pdf } from "@react-pdf/renderer"
import { setConfig } from "next/config"

export default function Home() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [commitmentDetails, setCommitmentDetails] = useState()


  async function fetchData(rowId) {
    const data2 = await fetch(
      "https://app.nocodb.com/api/v2/tables/m3yik9slvqdbzhl/records/" + id,
      options
    )
    const linkedData = await data2.json()
    console.log(linkedData)
    let brokers = []
    let borrowers = []
    let guarantors = []
    let costDetails = []
    let securityDetails = []
    let conditions = []
    if (linkedData._nc_m2m_Deals_Brokers) {
      for (let i = 0; i < linkedData._nc_m2m_Deals_Brokers.length; i++) {
        brokers.push(linkedData._nc_m2m_Deals_Brokers[i].Brokers.Name)
      }
    }
    if (linkedData._nc_m2m_Deals_Borrowers) {
      for (let i = 0; i < linkedData._nc_m2m_Deals_Borrowers.length; i++) {
        borrowers.push(linkedData._nc_m2m_Deals_Borrowers[i].Borrowers.Name)
      }
    }
    if (linkedData._nc_m2m_Deals_Guarantors) {
      for (let i = 0; i < linkedData._nc_m2m_Deals_Guarantors.length; i++) {
        guarantors.push(linkedData._nc_m2m_Deals_Guarantors[i].Guarantors.Name)
      }
    }
    if (linkedData._nc_m2m_Deals_Cost_Details) {
      for (let i = 0; i < linkedData._nc_m2m_Deals_Cost_Details.length; i++) {
        costDetails.push({
          label:
            linkedData._nc_m2m_Deals_Cost_Details[i].Cost_Details.Cost_Detail,
          value:
            linkedData._nc_m2m_Deals_Cost_Details[i].Cost_Details.Cost_Value,
        })
      }
    }
    if (linkedData._nc_m2m_Deals_Security_Details) {
      for (
        let i = 0;
        i < linkedData._nc_m2m_Deals_Security_Details.length;
        i++
      ) {
        securityDetails.push(
          linkedData._nc_m2m_Deals_Security_Details[i].Security_Details.Name
        )
      }
    }
    if (linkedData._nc_m2m_Deals_Conditions) {
      for (let i = 0; i < linkedData._nc_m2m_Deals_Conditions.length; i++) {
        conditions.push({
          label: linkedData._nc_m2m_Deals_Conditions[i].Conditions.Condition,
          value: linkedData._nc_m2m_Deals_Conditions[i].Conditions.Condition,
        })
      }
    }

    console.log(linkedData)

    const data = await fetch(
      "https://app.nocodb.com/api/v2/tables/m3yik9slvqdbzhl/records?offset=0&limit=25&where=&viewId=vwwskg3o1wkoyo4l",
      options
    )
    const tableData = await data.json()
    for (let i = 0; i < tableData.list?.length; i++) {
      if (tableData.list[i].id == rowId) {
        console.log(tableData.list[i])
        setCommitmentDetails({
          ...tableData.list[i],
          Brokers: brokers,
          Borrowers: borrowers,
          Guarantors: guarantors,
          Cost_Details: costDetails,
          Security_Details: securityDetails,
          Conditions: conditions,
        })
      }
    }
  }

  //https://app.nocodb.com/api/v2/tables/mgqwdeyg672qxnx/records?offset=0&limit=25&viewId=vw88qhkz4pg1k99v&expand=Borrowers

  useEffect(() => {
    fetchData(id)
    //CONCAT("https://localhost:3000?id=", {Id})
  }, [])

  useEffect(() => {
    console.log(commitmentDetails)
  }, [commitmentDetails])

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
