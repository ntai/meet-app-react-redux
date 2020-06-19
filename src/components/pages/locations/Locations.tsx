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
import {connect, useStore} from "react-redux";
import {IRootState} from "../../../store";
import {LocationSliceState, LocationType} from "../../../store/locations/types";
import {useEffect, useState} from "react";
import {tableIcons} from "../../widgets/TableGoodies";
import {googlify} from "../../../appConfig/google";
// import AddBox from '@material-ui/icons/AddBox';
import AddLocation from '@material-ui/icons/AddLocation';
import LinkIcon from '@material-ui/icons/Link';
import {LocationCityTwoTone} from "@material-ui/icons";
// import {ThunkDispatch} from "redux-thunk-recursion-detect";
import {Dispatch as ReduxDispatch} from 'redux';
import {
    LocationFetchCriteria,
    loadLocationsThunk
} from "../../../store/locations/actions";
import {Simulate} from "react-dom/test-utils";
import {TeamType} from "../../../store/teams/types";
import {useAPIError} from "../../../helpers/APIErrorProvider";
import {ApiError} from "redux-api-middleware";

// const load = Simulate.load;

const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));

interface ILocations {
    allLocations: {[slug:string]: LocationType};
    keyedLocations: { [queryString: string]: LocationSliceState }; // slugs. You need to join this with allLocations
    current: string[];
    currentQS: string,
    currentPage: number;
    totalCount: number;
    isLoading: boolean;
    fetchLoc: (criteria: LocationFetchCriteria,
               successCB?: (locs: QueryResult<LocationType>) => void,
               rejectCB?: (reason: any) => void) => void,
}

function stripSlug(loc: [string, LocationType]) : LocationType {
    return loc[1];
}

function Locations( {allLocations, keyedLocations, currentQS, current, currentPage, totalCount, isLoading, fetchLoc} : ILocations)
{
    const theme:Theme = useTheme();
    const classes = useStyles(theme);

    const [needle, setNeedle] = useState({ search: "", page: 0, pageSize: 20 } as Query<LocationType>);
    const [tableRef, ] = useState(React.createRef<MaterialTable<LocationType>>());

    console.log( `isLoading: ${isLoading} totalCount: ${totalCount} `);

    const locationActions = [
        {
            icon: () => <AddLocation />,
            tooltip: 'Add location',
            isFreeAction: true,
            onClick: () => null,
        },
    ];

    const {addError} = useAPIError();

    return (
        <Grid container className={classes.grid1Centered} >
            <MaterialTable<LocationType>
                tableRef={tableRef}
                style={ {width: "100%", minWidth: "800px"}}
                isLoading={isLoading}
                columns={[
                    { title: 'Name', field: 'name',
                        render: rowData => rowData.homepage ? <span> {rowData.name}<a href={rowData.homepage} target={"tab"}><LinkIcon /></a></span> : rowData.name,
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
                    { title: 'Address', field: 'address',
                        render: rowData => <a href={googlify(rowData.address)} target={"tab"}>{rowData.address}</a>,
                        headerStyle: {
                            maxWidth: 300,
                            width: "45%",
                            backgroundColor: '#eeeeff',
                        },
                        cellStyle: {
                            width: "45%",
                            maxWidth: 300,
                        },
                    },
                    {
                        title: 'Phone', field: 'phone',
                        headerStyle: {
                            maxWidth: 100,
                            width: "25%",
                            backgroundColor: '#eeeeff',
                        },
                        cellStyle: {
                            maxWidth: 100,
                            width: "25%",
                        },
                    },
                ]}

                data={(query) => {
                    setNeedle(query);
                    return new Promise<QueryResult<LocationType>>( (goodOne, badOne) => {
                        fetchLoc(query, goodOne, (reason: ApiError) =>
                        {
                            const emptyResult: QueryResult<LocationType> = {
                                page: 0,
                                data: [],
                                totalCount: 0
                            };
                            goodOne(emptyResult);
                            addError(reason.message + "  " + reason.response.detail, reason.status);
                        });
                    });
                }}

                icons={tableIcons}
                title="Locations"
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
        allLocations: state.locations.entities.allLocations,
        keyedLocations: state.locations.entities.keyedLocations,
        currentQS: state.locations.slice.fetchPath,
        current: state.locations.slice.locations,
        currentPage: state.locations.slice.page,
        totalCount: state.locations.slice.totalCount,
        isLoading: state.locations.entities.isFetching,
    }
};


const mapDispatchToProps = (dispatch : ReduxDispatch<any>) => ({
    fetchLoc:  (criteria: LocationFetchCriteria,
                successCB?: (locs: QueryResult<LocationType>) => void,
                rejectCB?: (reason: any) => void) => dispatch(loadLocationsThunk(criteria, successCB, rejectCB)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Locations);
