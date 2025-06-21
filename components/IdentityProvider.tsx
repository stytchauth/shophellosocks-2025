"use client";

import {IdentityProvider as BaseIdentityProvider, StytchProvider} from "@stytch/nextjs";
import {createStytchUIClient} from "@stytch/nextjs/ui";
import {StyleConfig} from "@stytch/vanilla-js";

const client = createStytchUIClient(process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || "");

const styles = {
  container: {
    borderColor: '#FFF'
  }

} satisfies StyleConfig

export function IdentityProvider() {
  return (
    <StytchProvider stytch={client} >
      <BaseIdentityProvider styles={styles}/>
    </StytchProvider>
  )
}