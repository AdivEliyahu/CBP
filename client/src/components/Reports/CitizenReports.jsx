import React, {useState, useEffect, Fragment, useContext} from "react";
import ReportEntry from "./ReportEntry";
import { MyContext } from '../../MyContext';
import {useNavigate} from "react-router-dom";

const CitizenReports = (props) => {
    const nav = useNavigate()
    const [reports, setReports] = useState({});
    const [isLoading, setLoading] = useState(true);
    const {user, setUser} = useContext(MyContext);

    const onNewReportClick = () => {
        nav("/new-report");
    }
    
    const getReports = async () => {
        try {
            const token = sessionStorage.getItem("token"); 
            
            const response = await fetch(`/report/reporter/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'GET'}
            );
            const json = await response.json();

            if (!response.ok) {
                throw new Error("Bad Network");
            } else {
                setReports(json);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    useEffect(() => {
        getReports();
    }, [isLoading]);


    return (
  
        isLoading ? 
        <div>loading</div> :
        reports && reports.length > 0 ?
        
        <Fragment>
            <div class="container mt-3">
                <div class="d-flex align-items-center mb-5">
                    <button class="btn btn-lg btn-success" onClick={onNewReportClick}>
                        New Report
                    </button>
                    <div class="mx-auto">
                        <div class="display-5 fw-bold text-body-emphasis">
                            My Reports
                        </div>
                    </div>
                </div>


                <div className="row">
                    {reports?.map(report => (
                    <div key={report.reportId} className="col-md-4">
                        <div className="w-100 d-flex flex-column mb-4">
                        <ReportEntry props={report}/>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            


      </Fragment>

        :
        <div>
            <button class="btn btn-lg btn-success mt-3 ms-5" onClick={onNewReportClick}>
                New Report
            </button>
            <div class="px-4 py-5 my-5 text-center">
                <div className="display-5 mb-5 fw-bold text-body-emphasis">
                    No reports found
                </div>
            </div>
        </div>

        
    );
}

export default CitizenReports;
