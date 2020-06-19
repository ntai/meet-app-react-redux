import * as React from "react";
import {
    Grid,
    Card,
    CardContent,
    CardActionArea,
    CardHeader,
    Typography,
    CardActions,
    CardMedia,
    Theme, useTheme
} from "@material-ui/core";

import MaterialTable, {QueryResult, Query} from "material-table";
import {makeStyles} from "@material-ui/core/styles";
import {appStyleClasses} from "../../appStyleClasses";
import {connect} from "react-redux";
import {IRootState} from "../../../store";
import {MeetSliceState, MeetType} from "../../../store/meets/types";
import {useState} from "react";
import {tableIcons} from "../../widgets/TableGoodies";
import AddAlert from '@material-ui/icons/AddAlert';
// import {getMeets} from '../../../store/meets/actions';

// FIXME: Just a stab for now.
function getMeets(a: any, b: any, c: any) {
    return null;
}

const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));

interface IMeets {
    allMeets: { [slug: string] : MeetType };
    keyedMeets: { [queryString: string]: MeetSliceState };
    current: string[];
    currentQS: string,
    currentPage: number;
    totalCount: number;
    isLoading: boolean;
    fetchMeet: (criteria: Query<MeetType>,
                resolveCB: (result: QueryResult<MeetType> | PromiseLike<QueryResult<MeetType>> | undefined) => void,
                rejectCB: (reason?: any) => void ) => void;
}

function stripSlug(loc: [string, MeetType]) : MeetType {
    return loc[1];
}

function Meets( {allMeets, keyedMeets, currentQS, current, currentPage, totalCount, isLoading, fetchMeet} : IMeets)
{
    const theme:Theme = useTheme();
    const classes = useStyles(theme);

    const [needle, setNeedle] = useState({ search: "", page: 0, pageSize: 20 } as Query<MeetType>);
    const [tableRef, ] = useState(React.createRef<MaterialTable<MeetType>>());

    console.log( `isLoading: ${isLoading} totalCount: ${totalCount} `);

    const locationActions = [
        {
            icon: () => <AddAlert />,
            tooltip: 'Add location',
            isFreeAction: true,
            onClick: () => null,
        },
    ];

    return (
        <Grid container className={classes.grid1Centered} >
            <MaterialTable<MeetType>
                tableRef={tableRef}
                style={ {width: "100%", minWidth: "800px"}}
                isLoading={isLoading}
                columns={[
                    { title: 'Name', field: 'name',
                        render: rowData => <a href="meets/api/{rowData.slug}" target={"tab"}>{rowData.name}</a>,
                        headerStyle: {
                            maxWidth: 200,
                            width: "30%",
                            backgroundColor: '#eeeeff',
                        },
                        cellStyle: {
                            width: "30%",
                            maxWidth: 200,
                        },
                    },
                ]}
                data={query => {
                    return new Promise<QueryResult<MeetType>>((resolve, reject) => {
                        setNeedle(query);
                        return fetchMeet(query, resolve, reject); })}}

                icons={tableIcons}
                title="Meets"
                options={{
                    selection: false,
                    rowStyle: rowData => ({ backgroundColor: rowData.tableData.checked ? '#37b15933' : '', paddingTop: 2, paddingBottom: 2}),
                    paging: true,
                    pageSize: needle.pageSize,
                    draggable: false,
                    toolbar: true,
                    search: true,
                    showTitle: true,
                    padding: 'dense',
                    pageSizeOptions: [10, 20, 50],
                }}
                /* actions={locationActions} */
            />
        </Grid>
    );
}


function mapStateToProps( state: IRootState) {
    return {
        allMeets: state.meets.entities.allMeets,
        keyedMeets: state.meets.entities.keyedMeets,
        currentQS: state.meets.slice.fetchPath,
        current: state.meets.slice.meets,
        currentPage: state.meets.slice.page,
        totalCount: state.meets.slice.totalCount,
        isLoading: state.meets.entities.isFetching,
    }
};

const mapDispatchToProps = {
    fetchMeet: getMeets,
}
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Meets);
