import React, { useEffect, useState } from 'react';
import {
    Col,
    Row,
    Button,
    Input,
} from "reactstrap";
import PropTypes from 'prop-types';

const WLPagination = (props) => {
    const perPageDD = [10, 15, 50, 100, 200, 500];
    const displayClass = props.alignClass ? props.alignClass : 'justify-content-md-end' ;

    const [page, setPage] = useState(1);
    const [per_page, setPerPage] = useState(10);
    useEffect(() => {
        setPage(props.pageData.current_page);
        setPerPage(props.pageData.per_page);
    }, [props.pageData.current_page, props.pageData.per_page]);


    const perPageChangeLocal = (e) => {
        setPerPage(e.target.value);
        props.perPageChange(e.target.value);
    }

    const pageChangeLocal = (e) => {
        let val = e.target.value;
        if (isNaN(val)) {
            val = props.pageData.current_page;
        } else {
            if (val !== '')
                val = parseInt(val);
        }

        setPage(val);
    }

    const gotoPage = (tPage) => {
        setPage(tPage);

        if (tPage === 0) {
            tPage = 1;
            setPage(1);
        }

        if (tPage > props.pageData.last_page) {
            tPage = props.pageData.last_page;
            setPage(props.pageData.last_page);
        }

        if (props.pageData.current_page !== tPage) {
            props.pageChange(tPage);
        }
    }

    const handleKeyDown = (event) => {
        let cPage = page;

        if (page === 0) {
            cPage = 1;
        }

        if (page > props.pageData.last_page) {
            cPage = props.pageData.last_page;
        }
        if (event.key === 'Enter') {
            setPage(cPage);
            props.pageChange(cPage);
        }
    }

    return (
        <div>
            <Row className={`${displayClass} justify-content-center align-items-center`}>
                <Col className="col-md-auto">
                    <select
                        className="form-select"
                        name="per_page"
                        value={per_page}
                        onChange={perPageChangeLocal}
                    >
                        {perPageDD.map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {"show"} {pageSize}
                            </option>
                        ))}
                    </select>
                </Col>
                <Col className="col-md-auto">
                    <div className="d-flex gap-1">
                        <Button
                            color="primary"
                            onClick={() => gotoPage(1)}
                            disabled={props.pageData.current_page === 1 || props.pageData.current_page === 0}
                        >
                            {"<<"}
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => gotoPage(props.pageData.current_page - 1)}
                            disabled={props.pageData.current_page === 1 || props.pageData.current_page === 0}
                        >
                            {"<"}
                        </Button>
                    </div>
                </Col>
                <Col className="col-md-auto d-none d-md-block">
                    {"page"}&nbsp;
                    <strong>
                        {props.pageData.current_page} {"of"} {props.pageData.last_page}
                    </strong>
                </Col>
                <Col className="col-md-auto">
                    <Input
                        type="text"
                        min={1}
                        style={props.pageData.last_page < page || page === 0 ? { width: 70, color: 'red' } : { width: 70 }}
                        name='page'
                        max={props.pageData.last_page}
                        value={page}
                        onChange={pageChangeLocal}
                        onKeyDown={handleKeyDown}
                        onBlur={(e) => gotoPage(page)}
                    />
                </Col>
                <Col className="col-md-auto">
                    <div className="d-flex gap-1">
                        <Button color="primary" onClick={() => gotoPage(props.pageData.current_page + 1)} disabled={props.pageData.current_page === props.pageData.last_page || props.pageData.last_page === 0}>
                            {">"}
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => gotoPage(props.pageData.last_page)}
                            disabled={props.pageData.current_page === props.pageData.last_page || props.pageData.last_page === 0}
                        >
                            {">>"}
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

WLPagination.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
};

export default WLPagination;
