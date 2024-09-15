import React, {useState} from 'react';
import ReportEntry from "./ReportEntry";
import {useNavigate} from "react-router-dom";

const FixedReports = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const navigate = useNavigate();

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleFetchData = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch(`/report/fixed/${year}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'GET'
                }
            );
            const json = await response.json();
            if (response.status === 200) {
                setReports(json)
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= 2000; i--) {
            years.push(i);
        }
        return years.map((yr) => (
            <option key={yr} value={yr}>
                {yr}
            </option>
        ));
    };
    const backHome = () => {
        navigate('/home');
    }

    return (
        <div class="container">
            <div class="my-5 text-center">
                <div className="display-5 mb-5 fw-bold text-body-emphasis">
                    City Reports
                </div>
            </div>

            <div class="row g-3">
                <div class="col-auto">
                    <label class="form-control-plaintext">Select Year:</label>
                </div>
                <div class="col-auto">
                    <select class="form-select" id="yearPicker" value={year} onChange={handleYearChange}>
                        {renderYearOptions()}
                    </select>
                </div>
                <div class="col-auto">
                    <button class="btn btn-primary mb-3" onClick={handleFetchData}>Get Reports</button>
                </div>
            </div>


            {(reports && !loading) ?
                                <div className="row">
                                {reports?.map(report => (
                                <div key={report.reportId} className="col-md-4">
                                    <div className="w-100 d-flex flex-column mb-4">
                                    <ReportEntry props={report}/>
                                    </div>
                                </div>
                                ))}
                            </div>
                : <h5>No Reports Found</h5>
            }

        </div>
    );
};

export default FixedReports;