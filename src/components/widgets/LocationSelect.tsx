// *https://www.registers.service.gov.uk/registers/country/use-the-api*
// import fetch from 'cross-fetch';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    AllLocationsCriteria,
    loadLocationsThunk,
    LocationFetchCriteria
} from "../../store/locations/actions";

import {
    LocationSliceState,
    LocationType
} from "../../store/locations/types";

import {Dispatch as ReduxDispatch} from "redux";
import {QueryResult} from "material-table";
import {connect} from "react-redux";


function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}


interface ILocationSelect {
    fetchLoc: (criteria: LocationFetchCriteria,
               successCB?: (locs: QueryResult<LocationType>) => void,
               rejectCB?: (reason: any) => void) => void,
}


function LocationSelect({fetchLoc} : ILocationSelect) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<LocationType[]>([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        const criteria : LocationFetchCriteria = Object.assign({}, AllLocationsCriteria);
        fetchLoc(criteria, (locs) =>
            {
                if (locs)
                    setOptions(locs.data);
            },
            undefined);
        // setOptions(loadLocations(""));
        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            id="location-select"
            style={{ width: 300 }}
            open={open}
            onOpen={() => { setOpen(true); }}
            onClose={() => { setOpen(false); }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Location"
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}


const mapDispatchToProps = (dispatch : ReduxDispatch<any>) => ({
    fetchLoc:  (criteria: LocationFetchCriteria,
                successCB?: (locs: QueryResult<LocationType>) => void,
                rejectCB?: (reason: any) => void) => dispatch(loadLocationsThunk(criteria, successCB, rejectCB)),
});

export default connect(
    null,
    mapDispatchToProps,
)(LocationSelect);
