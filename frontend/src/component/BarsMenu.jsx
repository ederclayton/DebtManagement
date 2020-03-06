/* <i className="fa fa-bars bars-menu"></i> 
<i className="fa fa-times bars-menu"></i>*/

import React from 'react'

export default props =>
<i className={`fa fa-${props.icon} bars-menu`} onClick={() => props.click()}></i> 