import React, { memo } from 'react'

function Copyright() {
  return (<div style={{ fontSize: '0.875rem' }}>
    &copy; {new Date().getFullYear()} Laegato is made remotely by <a className="has-text-weight-semibold" href="https://twitter.com/jaevernonaquino">@jaevernonaquino</a> and <a className="has-text-weight-semibold" href="https://twitter.com/m0rtillan">@m0rtillan</a>
  </div>)
}

export default memo(Copyright)