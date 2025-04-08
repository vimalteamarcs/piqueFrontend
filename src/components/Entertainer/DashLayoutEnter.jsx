import React from 'react'
import EnterDashNavbar from './EnterDashNavbar'
import { Helmet } from 'react-helmet-async'
import EnterSubNavbar from './EnterSubNavbar'

export default function DashLayoutEnter({ title, description, children }) {
  return (
    <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Helmet>

                <div className="content">
                    <EnterDashNavbar />
                    {children}
                </div>
        </>
  )
}
