import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import axios from "axios";

import { REPORT_CONFIG } from "../../../config/reportConfig";

import ReportHeader from "../../../components/Admin/Reports/ReportHeader";
import SummaryCards from "../../../components/Admin/Reports/SummaryCards";
import ReportFilters from "../../../components/Admin/Reports/ReportFilters";
import ReportTable from "../../../components/Admin/Reports/ReportTable";
import ExportButtons from "../../../components/Admin/Reports/ExportButtons";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function ReportViewer() {

    const { reportType } = useParams();

    const config = REPORT_CONFIG[reportType];

    const [loading, setLoading] = useState(true);

    const [summary, setSummary] = useState({});

    const [tableData, setTableData] = useState([]);

    const [masters, setMasters] = useState({ guestHouses: [], guestTypes: [] });

    const [filters, setFilters] = useState({});

    const loadMasters = async () => {

        try {

            const [

                guestHouses,

                guestTypes

            ] = await Promise.all([

                axios.get(

                    `${API_URL}/api/master/guesthouse-types`

                ),

                axios.get(

                    `${API_URL}/api/master/guest-types`

                )

            ]);

            setMasters({

                guestHouses:

                    guestHouses.data,

                guestTypes:

                    guestTypes.data

            });

        }

        catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        loadReport();

        loadMasters();

    }, [reportType]);

    const loadReport = async () => {

        try {

            setLoading(true);

            const response = await axios.get(

                `${API_URL}/api/admin/reports/${reportType}`,

                {

                    params: filters

                }

            );

            setSummary(

                response.data.summary

            );

            setTableData(

                response.data.data

            );

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    if (!config) {

        return (

            <div>

                Report Not Found

            </div>

        );

    }

    return (

        <div className="report-viewer">

            <ReportHeader

                title={config.title}

                subtitle={config.subtitle}

            />

            <SummaryCards

                cards={config.summaryCards}

                summary={summary}

            />

            <ReportFilters

                filters={config.filters}

                values={filters}

                masters={masters}

                onChange={setFilters}

                onSearch={loadReport}

            />

            <ExportButtons

                reportName={config.exportFileName}

                tableData={tableData}

                onRefresh={loadReport}

            />

            <ReportTable

                columns={config.columns}

                tableData={tableData}

                loading={loading}

            />

        </div>

    );

}

export default ReportViewer;