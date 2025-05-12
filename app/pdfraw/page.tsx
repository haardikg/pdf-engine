'use client'
import React from 'react'
import Pdf from '../pdf'
import dynamic from 'next/dynamic'

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
)

import { PDFDownloadLink } from '@react-pdf/renderer'

export default function Home() {
  return (
    <div>
      <PDFViewer className="w-screen h-screen">
        <Pdf />
      </PDFViewer>
    </div>
  )
}
