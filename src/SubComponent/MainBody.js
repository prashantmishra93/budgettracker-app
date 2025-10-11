import React from 'react'
import Body from './Body'

const MainBody = ({ showPanel: Component }) => {
    const isBody = Component === Body
    return (
        <>
            <div className="card shadow-sm p-4 mb-4">
                {isBody &&
                    <h3 className="mb-4 text-center">Finance Dashboard</h3>
                }
                <Component />
            </div>
        </>
    )
}

export default React.memo(MainBody)
