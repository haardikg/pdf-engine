import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
  Image,
} from "@react-pdf/renderer"
import { createTw } from "react-pdf-tailwind"
import config from "@/tailwind.config"
import logo from "./logo-header.png"

Font.register({
  family: "Times New Roman",
  src: "/times.ttf",
})

Font.register({
  family: "Times New Roman Semi Bold",
  src: "/timessb.ttf",
})

const tw = createTw(config)

const styles = StyleSheet.create({
  title: {
    fontSize: "12px",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "8px",
  },
  text: {
    fontSize: "11px",
    fontFamily: "Times New Roman",
    height: "auto",
    paddingTop: "15px",
    lineHeight: "1.25px",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 11,
    fontFamily: "Times New Roman",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "black",
    display: "flex",
    flexDirection: "column",
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
})

interface Cost {
  label: string
  value: number
}

interface Props {
  date: string
  borrowers: string[]
  guarantors: string[]
  principalAmount: number
  cocharge: number | null
  term: number
  ir: number
  ppr: number
  ptir: number
  ptppr: number
  closingDate: string
  sigFields: number
  mortgageAssignment: string
  securityDetails: string[]
  offerEndDate: string
  retainer: number
  conditions: string
  costDetails: Cost[]
  coLender?: string | null // ✅ ADDED
}

const defaultProps: Props = {
  date: "May 11 2024",
  borrowers: ["N/A"],
  guarantors: ["N/A"],
  principalAmount: 0,
  cocharge: null,
  term: 12,
  ir: 0,
  ppr: 0,
  ptir: 0,
  ptppr: 0,
  closingDate: "May 13 2024",
  sigFields: 2,
  mortgageAssignment: "N/A",
  securityDetails: ["124 Example St, L6P 2F9 ON"],
  offerEndDate: "May 12 2024",
  retainer: 0,
  conditions: "conditions",
  costDetails: [{ label: "Nothing", value: 0 }],
  coLender: null, // ✅ ADDED
}

function Pdf({
  date,
  borrowers,
  guarantors,
  principalAmount,
  cocharge,
  term,
  ir,
  ppr,
  ptir,
  ptppr,
  closingDate,
  sigFields,
  mortgageAssignment,
  securityDetails,
  offerEndDate,
  retainer,
  conditions,
  costDetails,
  coLender, // ✅ DESTRUCTURED
}: Props) {
  function handleNumber(originalNumber: string | number): string {
    let formattedNumber = new Intl.NumberFormat("en-US").format(
      originalNumber as number
    )
    if (formattedNumber.slice(-3)[0] !== ".") {
      if (
        formattedNumber.slice(-3)[-1] !== "." &&
        formattedNumber.includes(".")
      ) {
        formattedNumber = formattedNumber + "0"
      } else {
        formattedNumber = formattedNumber + ".00"
      }
    }
    return formattedNumber
  }

  function getYearFromDate(
    dateField: string | Date | null | undefined
  ): string | null {
    if (!dateField) return null
    const date = new Date(dateField)
    if (isNaN(date.getTime())) return null
    return date.getFullYear().toString()
  }

  function findMonthlyPayment(amount) {
    return handleNumber(((amount * (ir / 100)) / 12).toFixed(2))
  }

  let conditionIndex = 0

  function handleConditionIndex() {
    conditionIndex = conditionIndex + 1
    return conditionIndex
  }

  function findTotalCost() {
    let total = 0
    for (let i = 0; i < costDetails.length; i++) {
      total += costDetails[i].value
    }
    return handleNumber(total)
  }

  function formatDateToSentence(dateString: string): string {
    const [year, month, day] = dateString.split("-").map(Number)

    // Note: monthIndex is 0-based, so subtract 1 from month
    const date = new Date(year, month - 1, day)

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }

    return date.toLocaleDateString("en-US", options)
  }

  return (
    <Document>
      <Page size="LETTER" style={tw("p-4")}>
        {/*Start of First Page*/}
        <View style={tw("flex-auto py-12 px-20 flex-col")}>
          <View style={tw("flex-col items-center")}>
            <Image style={tw("h-12 mx-12")} src="/logo-header.png" />
          </View>
          <View style={styles.text}>
            <View style={tw("flex-col flex-auto justify-between h-36")}>
              <Text>Mortgage Commitment & Mortgage Instructions</Text>
              <Text>Date: {formatDateToSentence(date)}</Text>
              <Text>
                From: Aarti Mortgage Inc.
                {coLender ? ` and ${coLender}` : ""}
              </Text>

              <Text style={tw("ml-9")}>
                (Hereinafter referred to as the “Lender(s)” and/or “Chargee(s)”)
              </Text>
              <Text>To: {borrowers.join(", ")} </Text>
              <Text style={tw("ml-9")}>
                (Hereinafter referred to as the “Borrower(s)” and/or
                “Chargor(s)”)
              </Text>
            </View>
            <Text style={tw("mt-9 pr-4")}>
              Based upon and subject to the accuracy furnished to us by the
              Borrower(s)/Guarantor(s), we undertake to provide mortgage
              financing, subject to the following terms and conditions set out
              below which forms part of this commitment.
            </Text>
            <Text style={tw("mr-8")}>
              This Loan/Commitment is non-transferable, and the benefit may not
              be assigned to the borrower(s)/Guarantor(s), unless the chargee(s)
              agrees to such in writing and subject to additional costs.
            </Text>
            <View style={tw("flex-auto border h-auto flex-col mt-4")}>
              <View style={tw("flex-auto h-auto text-center")}>
                <Text style={tw("w-full")}>DETAILS OF MORTGAGE LOAN</Text>
              </View>
              <View style={tw("flex-auto border-t h-auto flex-row")}>
                <View style={tw("w-4/6")}>
                  <Text style={tw("border-b px-2")}>Borrower(s):</Text>
                  <Text style={tw("px-2")}>Guarantor:</Text>
                </View>
                <View style={tw("w-full")}>
                  <Text style={tw("border-b border-l px-2")}>
                    {" "}
                    {borrowers.join(", ")}
                  </Text>
                  <Text style={tw("border-l px-2")}>
                    {" "}
                    {guarantors.join(", ")}
                  </Text>
                </View>
              </View>
              <View style={tw("flex-auto border-t h-auto flex-row")}>
                <View style={tw("w-4/6")}>
                  <Text style={tw("px-2")}>Loan Amount:</Text>
                </View>
                <View style={tw("w-full")}>
                  <Text style={tw("border-l px-2")}>
                  {coLender && cocharge !== null
                  ? `$${handleNumber(principalAmount + cocharge)} ($${handleNumber(principalAmount)} Aarti Mortgage Inc. and $${handleNumber(cocharge)} ${coLender})`
                  : `$${handleNumber(principalAmount)}`}
                  </Text>
                </View>
              </View>

              <View style={tw("flex-auto border-t h-auto flex-row")}>
                <View style={tw("w-4/6")}>
                  <Text style={tw("px-2")}>Interest Rate:</Text>
                </View>
                <View style={tw("w-full h-full")}>
                  <Text style={tw("border-l px-2")}>
                    {term == 2 ? "Month 1" : "Month 1 to Month " + (term - 1)} -
                    at greater of {handleNumber(ir)}% OR BMO bank prime rate of
                    interest per annum, from time to time posted, plus{" "}
                    {handleNumber(ppr)}% calculated daily and compounded and
                    payable monthly on the interest adjustment date.
                    <br />
                  </Text>
                  <Text style={tw("border-l px-2")}>
                    {term == 2 ? "Month 2 " : "Month " + term + " "}
                    and every month thereafter - at the greater of{" "}
                    {handleNumber(ptir)}% OR BMO bank prime rate of interest per
                    annum, from time to time posted, plus {handleNumber(ptppr)}%
                    calculated daily and compounded and payable monthly on the
                    interest adjustment date.
                  </Text>
                </View>
              </View>
              <View style={tw("flex-auto border-t h-auto flex-row")}>
                <View style={tw("w-4/6")}>
                  <Text style={tw("px-2")}>Term:</Text>
                </View>
                <View style={tw("w-full")}>
                  <Text style={tw("border-l px-2")}>
                    {term == 1 ? "1 month" : term + " months"}
                  </Text>
                </View>
              </View>
              <View style={tw("flex-auto border-t h-auto flex-row")}>
                <View style={tw("w-4/6")}>
                  <Text style={tw("px-2")}>Closing Date:</Text>
                </View>
                <View style={tw("w-full")}>
                  <Text style={tw("border-l px-2")}>
                    {formatDateToSentence(closingDate)}
                  </Text>
                </View>
              </View>
              <View style={tw("flex-auto border-t h-auto flex-row")}>
                <View style={tw("w-4/6")}>
                  <Text style={tw("px-2")}>
                    Monthly Payment (Interest Only):
                  </Text>
                </View>
                <View style={tw("w-full")}>
                  <Text style={tw("border-l px-2")}>
                    {coLender && cocharge !== null
                    ? `$${findMonthlyPayment(principalAmount + cocharge)} ($${findMonthlyPayment(principalAmount)} Aarti Mortgage Inc. and $${findMonthlyPayment(cocharge)} ${coLender})`
      : `              $${findMonthlyPayment(principalAmount)}`}
                  </Text>
                </View>
              </View>
              <View style={tw("flex-auto border-t h-auto flex-row")}>
                <View style={tw("w-4/6")}>
                  <Text style={tw("px-2")}>Purpose of Loan:</Text>
                </View>
                <View style={tw("w-full")}>
                  <Text style={tw("border-l px-2")}>
                    {mortgageAssignment} Mortgage Assignment
                  </Text>
                </View>
              </View>
              <View style={tw("flex-auto border-t h-auto flex-row")}>
                <View style={tw("w-4/6")}>
                  <Text style={tw("px-2")}>Security Details:</Text>
                </View>
                <View style={tw("w-full flex flex-col")}>
                  {securityDetails.map((value) => (
                    <Text key={value} style={tw("border-l px-2")}>
                      {value}
                    </Text>
                  ))}
                </View>
              </View>
              <View style={tw("flex-auto border-t h-auto flex-row")}>
                <View style={tw("w-4/6")}>
                  <Text style={tw("px-2")}>
                    {mortgageAssignment} Mortgage/Charge On
                  </Text>
                </View>
                <View style={tw("w-full")}>
                  <Text style={tw("border-l px-2")}>
                    {securityDetails.length > 1
                      ? `The above properties`
                      : `The above property`}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={tw("ml-2 mt-4 mb-0 text-lg underline")}>
              Cost to the Borrower(s):
            </Text>
            <Text style={tw("ml-2")}>
              All legal costs, disbursements and fees as stated in Fee Schedule
              in connection with this mortgage required to complete this
              transaction: Payable by the borrower to be deducted from advance.
            </Text>
          </View>
          {/*Start of Second Page*/}
          <View style={styles.text}>
            <Text break style={tw("mt-16 mb-3 text-lg underline")}>
              Solicitors
            </Text>
            <Text>TBD</Text>
            <Text style={tw("mt-9 mb-4 underline")}>TIME</Text>
            <Text>IN ALL MATTERS, TIME SHALL BE OF THE ESSENCE.</Text>
            <Text style={tw("mt-5 mb-5")}>
              This offer to finance is open for acceptance by the
              Borrower(s)/Guarantor(s) until 5:00pm, on{" "}
              {formatDateToSentence(offerEndDate)}, by time and date, two copies
              of the Mortgage Loan Commitment and its schedules duly executed,
              shall be in our receipt
              {retainer > 0 ? (
                <>
                  with the nonrefundable commitment fee deposit of $
                  {handleNumber(retainer)}. :{" "}
                </>
              ) : (
                <>. </>
              )}
              If the herein offer is not accepted by the aforementioned time and
              date or offer as set forth is rendered null and void.
            </Text>
            <Text>
              This Mortgage Commitment, if accepted, is valid until the Final
              Funding Date: {formatDateToSentence(closingDate)}, after which
              time/date this commitment will be subject to rate and fee changes,
              the offer shall be null and void at the option of the lender.
            </Text>
            <Text style={tw("mt-5 mb-3 text-lg underline")}>Assignment</Text>
            <Text>
              Both the borrower(s) and the Lender(s) agree that the lender may
              assign in part or in whole this loan/mortgage commitment to a
              third-party lender.
            </Text>
            <Text style={tw("mt-5 mb-2 text-lg")}>
              CONDITIONS PRECEDENT TO FUNDING
            </Text>
            <Text style={tw("mb-5")}>
              This Mortgage Loan Commitment and its funding is further subject
              to Borrower(s)/Guarantor(s) providing all particulars mentioned on
              the next page, the property meeting our criteria as to quality and
              location, verification and the receipt of the following by the
              Final Funding Date in a form all to be fully satisfactory to
              Lender(s) and their solicitor(s) and the lender can withdraw this
              mortgage commitment at any time before the final funding.
            </Text>
          </View>
        </View>
        {/*Start of Third Page*/}
        <View style={styles.text} break>
          <View style={tw("flex-auto py-10 px-20 flex-col")}>
            {(() => {
              const lines = []
              let remaining = conditions
              while (remaining.length > 0) {
                const number = remaining.slice(0, 3)
                const nextIndex = remaining.indexOf("\n", 3)
                const text =
                  nextIndex !== -1
                    ? remaining.slice(3, nextIndex)
                    : remaining.slice(3)

                lines.push(
                  <View key={lines.length} style={styles.conditionRow}>
                    <Text style={styles.conditionNumber}>{number}</Text>
                    <Text style={styles.conditionText}>{text.trim()}</Text>
                  </View>
                )

                if (nextIndex === -1) break
                remaining = remaining.slice(nextIndex + 1)
              }
              return lines
            })()}
          </View>
        </View>
        {/*Start of Fourth Page*/}
        <View style={styles.text} break>
          <View style={tw("flex-auto py-10 px-20 flex-col")}>
            <Text>
              ACCEPTED and DATED in the City of _______________, day of
              ________________, {getYearFromDate(date)}.
            </Text>
            <View style={tw("flex-auto my-10 flex-row")}>
              <View>
                {Array.from({ length: sigFields }).map((_, index) => (
                  <View key={index}>
                    <Text>______________________________</Text>
                    <Text style={{ marginBottom: 32 }}>Borrower(s)/Chargor(s)</Text>
                  </View>
                ))}
                <Text>______________________________</Text>
                <Text>Lender(s)</Text>
              </View>
              <View style={tw("ml-28")}>
                {Array.from({ length: sigFields }).map((_, index) => (
                  <View key={index}>
                    <Text>______________________________</Text>
                    <Text style={{ marginBottom: 32 }}>Witness</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={tw("text-lg mb-2")}>Schedule A</Text>
            <Text>
              The total itemized cost to the Borrower(s) and/or Chargor(s) is as
              follows:
            </Text>
            <Text style={tw("mt-4")}>
              As stated in page 1 of the Mortgage commitment and Mortgage
              Instructions where it states COSTS TO THE BORROWER(S) here is the
              breakdown of costs, including legal, Lenders(s) fees and
              lender(s)’ administrative fees:
            </Text>
            {costDetails.map((cost) => (
              <View key={cost.label} style={tw("flex-auto flex-row mt-3 ")}>
                <Text style={tw("w-5/6")}>{cost.label}</Text>
                <Text>
                  {cost.value == 0 ? "NIL" : "$" + handleNumber(cost.value)}
                </Text>
              </View>
            ))}
            <View style={tw("flex-auto flex-row mt-16")}>
              <Text style={tw("w-5/6")}>TOTAL</Text>
              <Text>
                {findTotalCost() == "0.00" ? "NIL" : "$" + findTotalCost()}
              </Text>
            </View>
            <Text style={tw("mt-5")}>
              ** Note additional cost: Lender, Legal and Disbursements Cost to
              be added and provided by solicitor at time of funding and deducted
              from the proceeds of the advance.
            </Text>
            <View style={tw("flex-auto my-10 flex-row")}>
              <View>
                {Array.from({ length: sigFields }).map((_, index) => (
                  <View key={index}>
                    <Text>______________________________</Text>
                    <Text style={{ marginBottom: 32 }}>Borrower(s)/Chargor(s)</Text>
                  </View>
                ))}
              </View>
              <View style={tw("ml-28")}>
                {Array.from({ length: sigFields }).map((_, index) => (
                  <View key={index}>
                    <Text>______________________________</Text>
                    <Text style={{ marginBottom: 32 }}>Witness</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Mortgage Commitment
            Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  )
}

Pdf.defaultProps = defaultProps
export default Pdf
