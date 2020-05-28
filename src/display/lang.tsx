import React from 'react'
import { useIntl } from 'react-intl'
import { PrimitiveType } from 'intl-messageformat';
import { FormatXMLElementFn } from 'intl-messageformat';

export default function (props: {
  id?: string | number;
  description?: string | object;
  defaultMessage?: string;
  values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>
}) {
  const intl = useIntl()
  const { values, ...args } = props
  return <span>{intl.formatMessage(args, values)}</span>
}