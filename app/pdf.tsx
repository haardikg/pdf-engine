import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
  Image,
} from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import config from "@/tailwind.config";
import logo from "./logo-header.png";
Font.register({
  family: "Times New Roman",
  src: "/times.ttf",
});
Font.register({
  family: "Times New Roman Semi Bold",
  src: "/timessb.ttf",
});
Font.register({
  family: "Arial Bold",
  src: "/Arial Bold.ttf",
});

const tw = createTw(config);
const styles = StyleSheet.create({
  title: {
    fontSize: "13px",
    fontWeight: "bold",
    fontFamily: "Arial Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "11px",
    fontFamily: "Arial Bold",
  },
  subtext: {
    fontSize: "10px",
    marginTop: "7px",
  },
  subhead: {
    fontSize: "11px",
    fontFamily: "Arial Bold",
    width: "130px",
  },
  text: {
    fontSize: "11px",
    height: "auto",
    paddingTop: "15px",
    lineHeight: "1.25px",
  },
  conditionRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 4,
  },
  conditionNumber: {
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "Times New Roman Semi Bold",
    width: 20,
    marginTop: 3,
  },
  conditionText: {
    fontSize: 11,
    flex: 1,
  },
});

interface Cost {
  label: string;
  value: number;
}

interface props {
  date: string;
  borrowers: string[];
  guarantors: string[];
  principalAmount: number;
  term: number;
  ir: number;
  ppr: number;
  ptir: number;
  ptppr: number;
  closingDate: string;
  mortgageAssignment: string;
  securityDetails: string[];
  offerEndDate: string;
  retainer: number;
  conditions: string;
  costDetails: Cost[];
}
//
const defaultProps = {
  date: "May 11 2024",
  borrowers: ["N/A"],
  guarantors: ["N/A"],
  principalAmount: 0,
  term: 12,
  ir: 0,
  ppr: 0,
  ptir: 0,
  ptppr: 0,
  closingDate: "May 13 2024",
  mortgageAssignment: "N/A",
  securityDetails: ["124 Example St, L6P 2F9 ON"],
  offerEndDate: "May 12 2024",
  retainer: 0,
  conditions: "conditions",
  costDetails: [{ label: "Nothing", value: 0 }],
};

function Pdf({
  date,
  borrowers,
  guarantors,
  principalAmount,
  term,
  ir,
  ppr,
  ptir,
  ptppr,
  closingDate,
  mortgageAssignment,
  securityDetails,
  offerEndDate,
  retainer,
  conditions,
  costDetails,
}: props) {
  conditions =
    "1. 12 postdated cheques of $3000.00 to be issued in the name of Aarti Real Estate Enterprises Inc. and a bank draft of $6,000.00 in the name of Aarti Real Estate Enterprises inc.as commitment fee. 2. Rest of the terms and Schedule A will remain the same as per previous mortgage commitment and mortgage instructions dated February 06, 2024.";

  function handleNumber(originalNumber: string | number): string {
    let formattedNumber = new Intl.NumberFormat("en-US").format(
      originalNumber as number
    );
    if (formattedNumber.slice(-3)[0] !== ".") {
      if (
        formattedNumber.slice(-3)[-1] !== "." &&
        formattedNumber.includes(".")
      ) {
        formattedNumber = formattedNumber + "0";
      } else {
        formattedNumber = formattedNumber + ".00";
      }
    }
    return formattedNumber;
  }

  function findMonthlyPayment() {
    return handleNumber(((principalAmount * (ir / 100)) / 12).toFixed(2));
  }

  function findTotalCost() {
    let total = 0;
    for (let i = 0; i < costDetails.length; i++) {
      total += costDetails[i].value;
    }
    return handleNumber(total);
  }

  function formatDateToSentence(dateString: string): string {
    const [year, month, day] = dateString.split("-").map(Number);

    // Note: monthIndex is 0-based, so subtract 1 from month
    const date = new Date(year, month - 1, day);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  }

  const conditionList = conditions
    .split(/\n+/) // split on one or more newlines
    .filter((line) => line.trim()); // remove empty lines

  return (
    <Document>
      <Page size="LETTER" style={tw("p-4 pt-8")}>
        <View style={styles.text}>
          <View style={tw("flex-auto py-2 px-12 flex-col")}>
            <Text style={styles.title}>Mortgage Renewal Letter</Text>
            <View style={tw("flex-auto flex-row mt-4")}>
              <View style={tw("flex-auto flex-col")}>
                <Text style={tw("mb-4")}>DATE</Text>
                <Text style={styles.subtitle}>RE: Property Info</Text>
              </View>
              <View style={tw("flex-auto flex-col mr-24")}>
                <Text style={tw("mb-4")}>February 10, 2025</Text>
                <Text>107-38 Water Walk Drive, Markham, Ontario L3R6L4</Text>
              </View>
            </View>
            <Text style={styles.subtext}>
              Congratulations! Your Mortgage Renewal Request is Approved! The
              lender is prepared to provide a loan subject to the following
              terms and conditions and their normal underwriting procedures. The
              terms quoted are conditional on there being no outstanding Writs
              of Execution registered against the Borrower on closing
            </Text>
            <View style={tw("border mt-3 mb-3 py-1 px-1 border-black")}>
              <View style={tw("flex-auto flex-row")}>
                <Text style={styles.subhead}>Borrower(s):</Text>
                <Text>Siriskantharajan Vallipuranathar</Text>
              </View>
              <View style={tw("flex-auto flex-row mt-1")}>
                <Text style={styles.subhead}>Address of Property:</Text>
                <Text>107-38 Water Walk Drive, Markham, Ontario L3R6L4</Text>
              </View>
              <View style={tw("flex-auto flex-row mt-1")}>
                <Text style={styles.subhead}>Type:</Text>
                <Text>First Mortgage</Text>
              </View>
              <View style={tw("flex-auto flex-row mt-1")}>
                <Text style={styles.subhead}>Mortgage to Advance:</Text>
                <Text>$400,000.00</Text>
              </View>
              <View style={tw("flex-auto flex-row mt-1")}>
                <Text style={styles.subhead}>Interest Rate:</Text>
                <Text style={tw("w-[70%]")}>
                  Month 1 to Month 12 - at greater of 9.00% OR BMO bank prime
                  rate of interest per annum, from time to time posted, plus
                  3.80% calculated daily and compounded and payable monthly on
                  the interest adjustment date.{"\n"}Month 13 and every month
                  thereafter - at the greater of 24% or BMO bank prime rate of
                  interest per annum, from time to time posted, plus 18.80%
                  calculated daily and compounded and payable monthly on the
                  interest adjustment date.
                </Text>
              </View>
              <View style={tw("flex-auto flex-row mt-1")}>
                <Text style={styles.subhead}>Monthly Payment:</Text>
                <Text>$3,000.00</Text>
              </View>
              <View style={tw("flex-auto flex-row mt-1")}>
                <Text style={styles.subhead}>Prepayment Privilege:</Text>
                <Text>Closed</Text>
              </View>
              <View style={tw("flex-auto flex-row mt-1")}>
                <Text style={styles.subhead}>Term:</Text>
                <Text>13 Months</Text>
              </View>
              <View style={tw("flex-auto flex-row mt-1")}>
                <Text style={styles.subhead}>Commitment Fee:</Text>
                <Text>1.50% ($6,000.00)</Text>
              </View>
              <View style={tw("flex-auto flex-row mt-1")}>
                <Text style={styles.subhead}>Admin Fee:</Text>
                <Text>Waived</Text>
              </View>
              <View style={tw("flex-auto flex-row mt-1")}>
                <Text style={styles.subhead}>Renewal Date:</Text>
                <Text>February 12, 2025</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>Conditions</Text>
            <View style={tw("flex flex-col px-8")}>
              {conditions
                .split(/\n?\d+\.\s+/) // Split by number patterns like "1. ", "2. "
                .filter((c) => c.trim() !== "")
                .map((cond, idx) => (
                  <View
                    key={idx}
                    style={{ flexDirection: "row", marginBottom: 4 }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        minWidth: 22, // ensures space between number and content
                      }}
                    >
                      {`${idx + 1}.`}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        flex: 1,
                      }}
                    >
                      {cond.trim()}
                    </Text>
                  </View>
                ))}
            </View>
            <Text style={tw("text-[10px] mt-2")}>
              All costs are and fees are approximate and can change after
              underwriting the deal.
            </Text>
            <View style={tw("flex-auto my-2 flex-row")}>
              <View>
                {borrowers.map((borrower) => (
                  <View
                    key={borrower}
                    style={tw("text-center flex justify-center")}
                  >
                    <Text style={tw("mt-4")}>_______________</Text>
                    <Text style={styles.subtitle}>Borrower</Text>
                  </View>
                ))}
                <Text style={tw("mt-12")}>_______________</Text>
                <Text style={styles.subtitle}>Lender</Text>
              </View>
              <View style={tw("ml-[330px] mt-12")}>
                  <View>
                    <Text>_______________</Text>
                    <Text style={tw("mb-8")}>Date</Text>
                  </View>
                  <View>
                    <Text>_______________</Text>
                    <Text style={tw("mb-8")}>Date</Text>
                  </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

Pdf.defaultProps = defaultProps;
export default Pdf;
