import { Metadata } from 'next'
import React from 'react'
import ResetPasswordComponent from './ResetPasswordComponent'

export const metadata: Metadata = {
    title: "Réinitialisation du mot de passe - FIADEC-COOP-CA",
    description: "Page de modification du mot de passe pour la plateforme FIADEC-COOP-CA",
}

const ResetPasswordGetTokenPage = () => {
  return (
    <div>
      <ResetPasswordComponent/>
    </div>
  )
}

export default ResetPasswordGetTokenPage