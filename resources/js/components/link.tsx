import * as Headless from '@headlessui/react'
import { forwardRef } from 'react'
import { Link as NextLink, InertiaLinkProps } from '@inertiajs/react'

export const Link = forwardRef(function Link(
  props: InertiaLinkProps & React.ComponentPropsWithoutRef<'a'>,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <Headless.DataInteractive>
      <NextLink ref={ref} {...props} />
    </Headless.DataInteractive>
  )
})
