import React, {useState, useEffect, Fragment, useContext} from "react";
import ReportEntry from "./ReportEntry";
import { MyContext } from '../../MyContext';
import {useNavigate} from "react-router-dom";

function MyCalls() {
    const nav = useNavigate()
    const {user, setUser} = useContext(MyContext);
    const [reports, setReports] = useState({});
    const [isLoading, setLoading] = useState(true);

    const getReports = async () => {
        try {
            const token = sessionStorage.getItem("token"); 
            
            const response = await fetch(`/report/calls/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'GET'}
            );
            const json = await response.json();
            console.log(json);
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
        <div>loading</div> 
        :
        reports && reports.length > 0 ?
        <div>
            <div class="container mt-3">
                <div class="d-flex align-items-center mb-5">
                    <div class="mx-auto">
                        <div class="display-5 fw-bold text-body-emphasis">
                            My Calls
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
      </div>
        :
        <div>
            <div class="px-4 py-5 my-5 text-center">
                <div className="display-5 mb-5 fw-bold text-body-emphasis">
                    No open calls
                </div>
            </div>
        </div>
  )
}

export default MyCalls