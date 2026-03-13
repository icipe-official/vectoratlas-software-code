# -*- coding: utf-8 -*-
import datetime
from enum import Enum
from pprint import pprint
import re, os
import shutil
import pandas as pd
import openpyxl, csv

from tqdm import tqdm
from database.connect import get_connection
import traceback
import warnings
from request_templates import *
import uuid
import geopandas as gpd
from shapely.geometry import Point
import logging
import zipfile
from fastapi import Depends, FastAPI, HTTPException, status, File, UploadFile

AFRICA_SHP_PATH = "data/africa/africa_countries_vector.shp"

try:
    AFRICA_GDF = gpd.read_file(AFRICA_SHP_PATH).to_crs(epsg=4326)

    POSSIBLE_ISO3_COLUMNS = ["ISO3", "ISO_A3", "ADM0_A3", "COUNTRY_C"]
    ISO3_COLUMN = next(
        (c for c in POSSIBLE_ISO3_COLUMNS if c in AFRICA_GDF.columns), None
    )

    if ISO3_COLUMN is None:
        raise ValueError("No ISO3 column found in Africa shapefile")

    AFRICA_GDF[ISO3_COLUMN] = (
        AFRICA_GDF[ISO3_COLUMN].astype(str).str.upper().str.strip()
    )

except Exception as e:
    AFRICA_GDF = None
    ISO3_COLUMN = None
    print("Failed to load Africa shapefile:", e)


ISO2_TO_ISO3 = {
    "DZ": "DZA",
    "AO": "AGO",
    "BJ": "BEN",
    "BW": "BWA",
    "BF": "BFA",
    "BI": "BDI",
    "CM": "CMR",
    "CV": "CPV",
    "CF": "CAF",
    "TD": "TCD",
    "KM": "COM",
    "CG": "COG",
    "CD": "COD",
    "CI": "CIV",
    "DJ": "DJI",
    "EG": "EGY",
    "GQ": "GNQ",
    "ER": "ERI",
    "ET": "ETH",
    "GA": "GAB",
    "GM": "GMB",
    "GH": "GHA",
    "GN": "GIN",
    "GW": "GNB",
    "KE": "KEN",
    "LS": "LSO",
    "LR": "LBR",
    "LY": "LBY",
    "MG": "MDG",
    "ML": "MLI",
    "MW": "MWI",
    "MR": "MRT",
    "MU": "MUS",
    "MA": "MAR",
    "MZ": "MOZ",
    "NA": "NAM",
    "NE": "NER",
    "NG": "NGA",
    "RW": "RWA",
    "SN": "SEN",
    "SL": "SLE",
    "SO": "SOM",
    "ZA": "ZAF",
    "SS": "SSD",
    "SD": "SDN",
    "SZ": "SWZ",
    "TZ": "TZA",
    "TG": "TGO",
    "TN": "TUN",
    "UG": "UGA",
    "ZM": "ZMB",
    "ZW": "ZWE",
}

AFRICA_COUNTRIES_CODES = {
    "DZ": ["ALGERIA"],
    "AO": ["ANGOLA"],
    "BJ": ["BENIN"],
    "BW": ["BOTSWANA"],
    "BF": ["BURKINA FASO"],
    "BI": ["BURUNDI"],
    "CM": ["CAMEROON"],
    "CV": ["CAPE VERDE", "CABO VERDE"],
    "CF": ["CENTRAL AFRICAN REPUBLIC"],
    "TD": ["CHAD"],
    "KM": ["COMOROS"],
    "CG": ["CONGO"],
    "CD": ["DRC", "DR CONGO", "CONGO, THE DEMOCRATIC REPUBLIC OF THE"],
    "CI": ["COTE D'IVOIRE", "COTE DIVOIRE"],
    "DJ": ["DJIBOUTI"],
    "EG": ["EGYPT"],
    "GQ": ["EQUATORIAL GUINEA"],
    "ER": ["ERITREA"],
    "ET": ["ETHIOPIA"],
    "GA": ["GABON"],
    "GM": ["THE GAMBIA", "GAMBIA"],
    "GH": ["GHANA"],
    "GN": ["GUINEA"],
    "GW": ["GUINEA-BISSAU", "GUINEA BISSAU"],
    "KE": ["KENYA"],
    "LS": ["LESOTHO"],
    "LR": ["LIBERIA"],
    "LY": ["LYBIA", "LIBYAN ARAB JAMAHIRIYA"],
    "MG": ["MADAGASCAR"],
    "ML": ["MALI"],
    "MW": ["MALAWI"],
    "MR": ["MAURITANIA"],
    "MU": ["MAURITIUS"],
    "YT": ["MAYOTTE"],
    "MA": ["MOROCCO"],
    "MZ": ["MOZAMBIQUE"],
    "NA": ["NAMIBIA"],
    "NE": ["NIGER"],
    "NG": ["NIGERIA"],
    "RE": ["REUNION ISLAND"],
    "RW": ["RWANDA"],
    "ST": ["SAO TOME AND PRINCIPE"],
    "SN": ["SENEGAL"],
    "SC": ["SEYCHELLES"],
    "SL": ["SIERRA LEONE"],
    "SO": ["SOMALIA"],
    "ZA": ["SOUTH AFRICA"],
    "SS": ["SOUTH SUDAN"],
    "SD": ["SUDAN"],
    "SZ": ["SWAZILAND", "ESTWATINI"],
    "TZ": ["TANZANIA", "TANZANIA, UNITED REPUBLIC OF"],
    "TG": ["TOGO"],
    "TN": ["TUNISIA"],
    "UG": ["UGANDA"],
    "EH": ["WESTERN SAHARA"],
    "ZM": ["ZAMBIA"],
    "ZW": ["ZIMBABWE"],
}

logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.DEBUG)
DELIMITER = "|"
MATCH_PATTERN = "./data/matching.csv"
NEW_DATA_HEADER = "confidentiality_status|bio_data|adult_data|larval_site_data|insecticide_resistance_data|source_id|citation_doi|author|article_title|journal_title|publication_year|study_sampling_design|personal_communication|contact_authors|source_notes|country|site|latitude_1|longitude_1|latitude_2|longitude_2|latitude_3|longitude_3|latitude_4|longitude_4|latitude_5|longitude_5|latitude_6|longitude_6|latitude_7|longitude_7|latitude_8|longitude_8|confidence_in_georef|area_type|georef_source|admin_level_1|admin_level_2|site_notes|insecticide_control|control_type|itn_use|control_notes|sampling_occurrence_1|occurrence_n_1|sampling_occurrence_2|occurrence_n_2|sampling_occurrence_3|occurrence_n_3|sampling_occurrence_4|occurrence_n_4|occurrence_n_total|occurrence_notes|binary_presence|binary_absence|abundance_data_in_a_graph|month_start|month_end|year_start|year_end|season_given|season_calc|rainfall_time|season_notes|species|species_notes|species_id_1|species_id_2|roof|walls|house_screening|open_eaves|cooking|housing_notes|common_occupation_1|common_occupation_2|common_occupation_3|outdoor_activities_at_night|sleeping_outdoors|outdoor_timings_hours|outdoor_activities_notes|average_bedtime|average_wake_time|time_people_leave_home_in_morning|hours_spent_away_from_home_per_day|seasonal_labour|community_notes|forest|farming|farming_notes|livestock_1|livestock_2|livestock_3|livestock_4|livestock_notes|local_plants|environment_notes|sampling_biology_1|sampling_biology_2|sampling_biology_3|sampling_biology_n|parity_n|parity_total|parity_percent|daily_survival_rate_percent|fecundity_mean_batch_size|gonotrophic_cycle_days|biology_notes|sampling_infection_1|sampling_infection_2|sampling_infection_3|sampling_infection_n|sporozoite_rate_by_dissection_n|sporozoite_rate_by_dissection_total|sporozoite_rate_by_dissection_percent|sporozoite_rate_by_csp_n_pool|sporozoite_rate_by_csp_total_pool|sporozoite_rate_by_csp_percent|sporozoite_rate_p_falciparum_n|sporozoite_rate_p_falciparum_total|sporozoite_rate_p_falciparum_percent|sporozoite_rate_p_vivax_n|sporozoite_rate_p_vivax_total|sporozoite_rate_p_vivax_percent|oocyst_n|oocyst_total|oocyst_rate_percent|eir|eir_period|ext_incubation_period_days|infection_notes|hbr_sampling_indoor|indoor_hbr|hbr_sampling_outdoor|outdoor_hbr|hbr_sampling_combined_1|hbr_sampling_combined_2|hbr_sampling_combined_3|hbr_sampling_combined_n|combined_hbr|hbr_unit|abr_sampling_1|abr_sampling_2|abr_sampling_3|abr_sampling_n|abr|abr_unit|biting_rate_notes|host_sampling_indoor|indoor_host_n|indoor_host_total|indoor_host_percent|host_sampling_outdoor|outdoor_host_n|outdoor_host_total|outdoor_host_percent|host_sampling_combined_1|host_sampling_combined_2|host_sampling_combined_3|host_sampling_combined_n|combined_host_n|combined_host_total|combined_host|host_unit|host_sampling_other_1|host_sampling_other_2|host_sampling_other_3|host_sampling_other_n|other_host_n|other_host_total|host_other|host_other_unit|host_notes|biting_number_of_sampling_nights_indoors|biting_sampling_indoor|indoor_biting_n|indoor_biting_total|indoor_biting_data|biting_number_of_sampling_nights_outdoors|biting_sampling_outdoor|outdoor_biting_n|outdoor_biting_total|outdoor_biting_data|indoor_outdoor_biting_unit|indoor_outdoor_biting_notes|biting_activity_indoor_number_of_sampling_nights|1800_1900_in|1900_2000_in|2000_2100_in|2100_2200_in|2200_2300_in|2300_0000_in|0000_0100_in|0100_0200_in|0200_0300_in|0300_0400_in|0400_0500_in|0500_0600_in|1830_2130_in|2130_0030_in|0030_0330_in|0330_0630_in|biting_activity_outdoor_number_of_sampling_nights|1800_1900_out|1900_2000_out|2000_2100_out|2100_2200_out|2200_2300_out|2300_0000_out|0000_0100_out|0100_0200_out|0200_0300_out|0300_0400_out|0400_0500_out|0500_0600_out|1830_2130_out|2130_0030_out|0030_0330_out|0330_0630_out|biting_activity_combined_number_of_sampling_nights|1800_1900_combined|1900_2000_combined|2000_2100_combined|2100_2200_combined|2200_2300_combined|2300_0000_combined|0000_0100_combined|0100_0200_combined|0200_0300_combined|0300_0400_combined|0400_0500_combined|0500_0600_combined|1830_2130_combined|2130_0030_combined|0030_0330_combined|0330_0630_combined|biting_notes|resting_sampling_indoor|unfed_indoor|fed_indoor|gravid_indoor|total_indoor|resting_sampling_outdoor|unfed_outdoor|fed_outdoor|gravid_outdoor|total_outdoor|resting_sampling_other|unfed_other|fed_other|gravid_other|total_other|resting_unit|resting_notes|larval_instars_found_1|larval_habitat_1|larval_site_character_1|larval_turbidity_1|larval_salinity_1|larval_vegetation_1|larval_shade_1|larval_water_current_1|larval_size_1|larval_depth_1|larval_permanence_1|larval_other_fauna_1|larval_control_present_1|larval_instars_found_2|larval_habitat_2|larval_site_character_2|larval_turbidity_2|larval_salinity_2|larval__vegetation_2|larval_shade_2|larval_water_current_2|larval_size_2|larval_depth_2|larval_permanence_2|larval_other_fauna_2|larval_control_present_2|larval_instars_found_3|larval_habitat_3|larval_site_character_3|larval_turbidity_3|larval_salinity_3|larval_vegetation_3|larval_shade_3|larval_water_current_3|larval_size_3|larval_depth_3|larval_permanence_3|larval_other_fauna_3|larval_control_present_3|larval_notes|bioassay_representative_of_complex_at_site|bioassay_representative_of_complex_at_site_if_disaggregated_values_combined_without_adjustments|generation|wild_caught_larvae_or_adults|lower_age_days|upper_age_days|test_protocol|insecticide_tested|insecticide_class|irac_moa|irac_moa_code|concentration_percent|concentration_micrograms|exposure_period_min|intensity_multiplier|synergist_tested|synergist_concentration|synergist_concentration_unit|mosquitoes_tested_n|mosquitoes_dead_n|percent_mortality|knock_down_exposure_time_min|mosquitoes_knocked_down_n|knock_down_percent|kdt_50_percent_min|kdt_90_percent_min|kdt_95_percent_min|bioassay_notes|genotypic_test_representative_of_species_at_site|genotypic_test_representative_of_species_at_site_if_disaggregated_values_combined_without_adjustments|minor_species_missing_allele_frequency_data|notes_on_population_representative|genotypic_sample_first_been_through_bioassay_tests|genotypic_sample_linked_to_a_specific_bioassay|bioassay_subsample_used_in_genotypic_test|notes_on_bioassay_linkage|vgsc_method_1|vgsc_method_2|vgsc_number_of_mosquitoes_tested|vgsc_generation|vgsc_kdr_notes|vgsc995l_vgsc995l_n|vgsc995l_vgsc995l_percent|vgsc995l_vgsc995f_n|vgsc995l_vgsc995f_percent|vgsc995f_vgsc995f_n|vgsc995f_vgsc995f_percent|vgsc995l_vgsc995s_n|vgsc995l_vgsc995s_percent|vgsc995s_vgsc995s_n|vgsc995s_vgsc995s_percent|vgsc995l_vgsc995c_n|vgsc995l_vgsc995c_percent|vgsc995c_vgsc995c_n|vgsc995c_vgsc995c_percent|null_vgsc995c_or_vgsc995c_vgsc995c_n|null_vgsc995c_or_vgsc995c_vgsc995c_percent|vgsc995f_vgsc995s_n|vgsc995f_vgsc995s_percent|vgsc995f_vgsc995c_n|vgsc995f_vgsc995c_percent|susceptible_susceptible_n|susceptible_susceptible_percent|resistant_susceptible_n|resistant_susceptible_percent|resistant_resistant_n|resistant_resistant_percent|vgsc995l_percent|vgsc995f_percent|vgsc995s_percent|vgsc995c_percent|kdr_percent|vgsc402v_vgsc402v_n|vgsc402v_vgsc402v_percent|vgsc402v_vgsc402l_n|vgsc402v_vgsc402l_percent|vgsc402l_vgsc402l_n|vgsc402l_vgsc402l_percent|vgsc402v_percent|vgsc_402l_percent|vgsc1570n_vgsc1570n_n|vgsc1570n_vgsc1570n_percent|vgsc1570n_vgsc1570y_n|vgsc1570n_1570y_percent|vgsc1570y_vgsc1570y_n|vgsc1570y_vgsc1570y_percent|vgsc1570n_percent|vgsc1570y_percent|rdl_method_1|rdl_number_of_mosquitoes_tested|rdl_generation|rdl_notes|rdl296c_rdl296c__n|rdl296c_rdl296c_percent|rdl296c_rdl296g_n|rdl296c_rdl296g_percent|rdl296g_rdl296g_n|rdl296g_rdl296g_percent|rdl296c_rdl296s_n|rdl296c_rdl296s_percent|rdl296s_rdl296s_n|rdl296s_rdl296s_percent|rdl296g_rdl296s_n|rdl296g_rdl296s_percent|rdl296c_percent|rdl296g_percent|rdl296s_percent|ace1_method_1|ace1_number_of_mosquitoes_tested|ace1_generation|ace1_notes|ace1_280g_ace1_280g_n|ace1_280g_ace1_280g_percent|ace1_280g_ace1_280s_n|ace1_280g_ace1_280s_percent|ace1_280s_ace1_280s_n|ace1_280s_ace1_280s_percent|ace1_280g_percent|ace1_280s_percent|gste_method_1|gste_number_of_mosquitoes_tested|gste_generation|gste_notes|gste2_114I_gste2_114I_n|gste2_114I_gste2_114I_percent|gste2_114I_gste2_114t_n|gste2_114I_gste2_114t_percent|gste2_114t_gste2_114t_n|gste2_114t_gste2_114t_percent|gste2_114I_percent|gste2_114t_percent|gste2_119l_gste2_119l_n|gste2_119l_gste2_119l_percent|gste2_119l_gste2_119v_n|gste2_119l_gste2_119v_percent|gste2_119v_gste2_119v_n|gste2_119v_gste2_119v_percent|gste2_119l_percent|gste2_119v_percent|cyp_method_1|cyp_number_of_mosquitoes_tested|cyp_generation|cyp_notes|cyp4j5_43l_cyp4j5_43l_n|cyp4j5_43l_cyp4j5_43l_percent|cyp4j5_43l_cyp4j5_43f_n|cyp4j5_43l_cyp4j5_43f_percent|cyp4j5_43f_cyp4j5_43f_n|cyp4j5_43f_cyp4j5_43f_percent|cyp4j5_43l_percent|cyp4j5_43f_percent|cyp6p4_236wt_cyp6p4_236wt_n|cyp6p4_236wt_cyp6p4_236wt_percent|cyp6p4_236wt_cyp6p4_236m_n|cyp6p4_236wt_cyp6p4_236m_percent|cyp6p4_236m_cyp6p4_236m_n|cyp6p4_236m_cyp6p4_236m_percent|cyp6p4_236wt_percent|cyp6p4_236m_percent|cyp6aap_wt_cyp6aap_wt_n|cyp6aap_wt_cyp6aap_wt_percent|cyp6aap_wt_cyp6aap_dup1_n|cyp6aap_wt_cyp6aap_dup1_percent|cyp6aap_dup1_cyp6aap_dup1_n|cyp6aap_dup1_cyp6aap_dup1_percent|cyp6aap_wt_percent|cyp6aap_dup1_percent|data_abstracted_by|data_checked_by|final_check_by"


def get_string_val(val):
    val = val.translate(str.maketrans({"'": r"\'"}))
    if val:
        return val.strip()  # removing begining and ending space
    else:
        return ""


def get_string_key_val(data_row, key: str):
    val = ""
    if key in data_row:
        val = data_row[key]

    return get_string_val(val)


def get_uuid():
    return uuid.uuid4()


def get_int_val(num: str):
    num = str(num).replace(",", "")
    num = num.split(".")[0]
    num = num.replace(" ", "")
    try:
        return int(num)
    except ValueError:
        return 0


def get_int_key_val(data_row, key: str):
    num = "0"
    if key in data_row:
        num = data_row[key]

    return get_int_val(num)


def get_float_val(num: str):
    num = str(num).replace("−", "-")
    num = num.replace(" ", "")
    try:
        return float(num)
    except ValueError:
        return 0.0


def get_float_key_val(data_row, key: str):
    num = "0"
    if key in data_row:
        num = data_row[key]

    return get_float_val(num)


def get_bool_val(val: str):
    if val:
        if val == "yes":
            return True
    return False


def get_bool_key_val(data_row, key: str):
    val = "0"
    if key in data_row:
        val = data_row[key]

    return get_bool_val(val)


def record_exist(conn, query):
    cursor = conn.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    if rows:
        return rows[0][0]
    else:
        return False


def datetime_from_month_year(month: str, year: str):
    y = get_int_val(year)
    m = get_int_val(month)
    fd = datetime.datetime.now()
    if y != 0 and m != 0:
        fd = datetime.datetime(year=get_int_val(year), month=get_int_val(month), day=1)
    return fd


def run_query(conn, query, params=None):
    with conn.cursor() as cursor:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
    conn.commit()


def excel_to_csv(filepath, target="./demo/input/data.csv") -> tuple[bool, str]:
    try:
        warnings.simplefilter(action="ignore", category=UserWarning)  # due to openpyxl
        wrkbk = openpyxl.load_workbook(filepath)
        sh = wrkbk.active
        col = csv.writer(open(target, "w", newline=""), delimiter="|")
        # TODO: make the header of the csv dynamic, currently assuming data comme in Vector atlas data template with two header rows.
        for row in tqdm(
            list(sh.iter_rows(min_row=2, min_col=1)),
            desc="Converting to CSV ... ",
            unit=" rows",
        ):  # max_row=500
            col.writerow([cell.value for cell in row])
        return True, None
    except Exception as e:
        print("ERROR: ", traceback.format_exc())
        return False, str(e)


def get_country_code_from_name(name: str) -> tuple[bool, str]:
    """return country code based on provided name"""
    for code, known_names in AFRICA_COUNTRIES_CODES.items():
        for value in known_names:
            if name.upper().strip() == value.upper().strip():
                return True, code
    return False, "Country code does not exist"


def validate_coordinates(country_code: str, lat: float, lon: float) -> bool:
    """Validate coordinates using master Africa ISO3 shapefile"""

    if AFRICA_GDF is None or ISO3_COLUMN is None:
        return False

    try:
        point = Point(lon, lat)

        iso3 = ISO2_TO_ISO3.get(country_code.upper())
        if not iso3:
            logger.error(f"No ISO3 mapping for {country_code}")
            return False

        country_row = AFRICA_GDF[AFRICA_GDF[ISO3_COLUMN] == iso3]

        if country_row.empty:
            logger.error(f"ISO3 not found in shapefile: {iso3}")
            return False

        return country_row.buffer(0.01).contains(point).any()

    except Exception as e:
        logger.error(f"Shapefile validation error: {e}")
        return False


def ensure_directory_exists(directory: str):
    from pathlib import Path

    Path(directory).mkdir(parents=True, exist_ok=True)


def store_uploaded_file(upFileObj: UploadFile) -> str:
    """save uploaded file to upload directory and return path"""

    def _unzip():
        extraction_path = "".join(fname.split(".")[:-1])  # exclude the extension
        # Open the zip file in read mode ('r')
        with zipfile.ZipFile(fname, "r") as zip_ref:
            # Extract all contents to the specified directory
            zip_ref.extractall(extraction_path)

        # after extracting to path, return the name of the first file
        onlyfiles = [
            f
            for f in os.listdir(extraction_path)
            if os.path.isfile(os.path.join(extraction_path, f))
        ]
        if onlyfiles:
            return os.path.join(extraction_path, onlyfiles[0])

        return None

    contents = upFileObj.file.read()
    ensure_directory_exists("uploads")
    fname = f"uploads/{upFileObj.filename.split('.')[0]}_{datetime.datetime.now()}.{upFileObj.filename.split('.')[1]}"
    with open(fname, "wb") as f:
        f.write(contents)

    # if it is a zip file, extract contents
    if upFileObj.filename.endswith(".zip"):
        return _unzip()
    return fname


def validate_authors(authors_names):
    return authors_names


def is_old_data(filename):
    with open(filename, "r") as f:
        lines = f.readlines()
        if lines and "source_ID" in lines[0]:
            return True
        else:
            return False


def change_csv_separator(filename, dest):
    df = pd.read_csv(
        filename, index_col=False, encoding="ISO-8859-1", sep=",", dialect="excel"
    )
    df.to_csv(dest, index=False, sep=DELIMITER)
    # writer = csv.writer(open(dest, 'w',), delimiter=DELIMITER)
    # writer.writerows(reader)


def remove_header_groups(
    filename, dest, separator, header_row_idx=0, delete_src_file=True
):
    df = pd.read_csv(
        filename,
        index_col=False,
        encoding="ISO-8859-1",
        sep=separator,  # ",",
        # dialect="excel",
        skip_blank_lines=True,
        header=header_row_idx,
    )
    if delete_src_file:
        # IF we are deleting, do it here since dest file may be the same file
        if os.path.isfile(filename):
            os.remove(filename)
    df.to_csv(dest, index=False, sep=DELIMITER)
    # writer = csv.writer(open(dest, 'w',), delimiter=DELIMITER)
    # writer.writerows(reader)


def validate_data(filepath: str) -> tuple[bool, int, list, str, dict]:
    """Validate data
    Args:
        filepath (str): _description_

    Returns:
        tuple[bool, int, list, str, dict]: A tuple of:
            - If the validation was successful or not
            - The count of errors if any
            - The actual list of errors are strings
            - The error message that occurred during validation
            - An object whose keys contain different error types and the values is an array of offending rows or other errors
    """

    def _validate_file_structure():
        # check for column header row (determine where the headers are located)
        # check for column header names (expected column names)
        pass

    errorsObj = {
        "WRONG_COORDS": [],
        "NO_AUTHORS": [],
        "COUNTRY_CODES": [],
        "GENERAL_ERRORS": [],
    }
    errors = []
    runs = 0
    ensure_directory_exists("data/temp")
    try:
        basename = os.path.basename(filepath).split(".")[0]
        if filepath.endswith(".xlsx"):
            res, error = excel_to_csv(
                filepath, target=f"data/temp/{basename}_unaligned.csv"
            )
            if not res:
                errorsObj["GENERAL_ERRORS"].append(error)
                errors.append(error)
                return False, len(errors), errors, str(e), errorsObj
        elif filepath.endswith(".csv"):
            shutil.copyfile(filepath, f"data/temp/{basename}_unaligned_base.csv")
            change_csv_separator(
                f"data/temp/{basename}_unaligned_base.csv",
                f"data/temp/{basename}_unaligned.csv",
            )
            # shutil.copyfile(filepath, f"data/temp/{basename}_unaligned.csv")
        if is_old_data(f"data/temp/{basename}_unaligned.csv"):
            res, error = align_data_old_to_new(
                f"data/temp/{basename}_unaligned.csv",
                f"data/temp/{basename}_aligned.csv",
            )
            if not res:
                errorsObj["GENERAL_ERRORS"].append(error)
                errors.append(error)
                return False, len(errors), errors, str(e), errorsObj
        else:
            # change_csv_separator(f"data/temp/{basename}_unaligned.csv", f"data/temp/{basename}_aligned.csv")
            shutil.copyfile(
                f"data/temp/{basename}_unaligned.csv",
                f"data/temp/{basename}_aligned.csv",
            )

        dest_file = f"data/temp/{basename}_aligned.csv"
        # Remove unnecessary header groups
        header_row = 0
        with open(f"data/temp/{basename}_aligned.csv", "r") as f:
            reader = csv.DictReader(f, delimiter=DELIMITER)
            data = list(reader)

            # check if the first row is a header
            if "confidentiality status" in reader.fieldnames:
                header_row = 0
                pass
            else:
                # else try find the header in other rows
                for i, item in enumerate(data):
                    if "confidentiality status" in [x for x in item.values()]:
                        header_row = i + 1  # add 1 to take care of the header row
                        break

        if header_row != 0:
            remove_header_groups(
                filename=dest_file,
                dest=dest_file,
                separator="|",
                header_row_idx=header_row,
                delete_src_file=True,
            )

        with open(dest_file, "r") as f:
            reader = csv.DictReader(f, delimiter=DELIMITER)
            data = list(reader)
            if not data:
                errorsObj["GENERAL_ERRORS"].append(
                    "The file does not contain any records"
                )
                errors.append("The file does not contain any records")
                return (
                    False,
                    len(errors),
                    errors,
                    str("The file does not contain any records"),
                    errorsObj,
                )

            for i, item in enumerate(data):
                logger.debug(f"Evaluating row: {1+1}")
                country_code = item["country"] if "country" in item else ""
                res, code = (
                    get_country_code_from_name(country_code)
                    if "country" in item
                    else (False, None)
                )
                if not res:
                    err = f"COUNTRY CODE {country_code} does not exist"
                    logger.error(err)
                    item["COUNTRY_CODES"] = True
                    errors.append(item)
                    errorsObj["COUNTRY_CODES"].append({"row": i + 1, "error": err})

                lat = (
                    get_float_val(item["latitude_ 1"])
                    if "latitude_ 1" in item
                    else None
                )
                if lat == None:
                    # some files will have latitude_1 or latitude_ 1 as the headers
                    lat = (
                        get_float_val(item["latitude_1"])
                        if "latitude_1" in item
                        else None
                    )
                lon = (
                    get_float_val(item["longitude_1"])
                    if "longitude_1" in item
                    else None
                )
                if code and lat and lon:
                    runs = runs + 1
                    check1 = validate_coordinates(code, lat, lon)
                    check2 = (
                        validate_authors(item["author"]) if "author" in item else True
                    )
                    # evaluation = evaluation and check1 and check2
                    if not check1:
                        err = f"COUNTRY: {item['country']} -- CODE: {code} -- LAT: {lat} -- LON: {lon}"
                        logger.debug(err)
                        item["ERROR_WRONG_COORDS"] = True
                        errors.append(item)
                        errorsObj["WRONG_COORDS"].append({"row": i + 1, "error": err})
                    if not check2:
                        err = "Missing Authors"
                        item["ERROR_NO_AUTHORS"] = True
                        errors.append(item)
                        errorsObj["NO_AUTHORS"].append({"row": i + 1, "error": err})
                elif not lat or not lon:
                    err = "Missing coordinates"
                    item["ERROR_WRONG_COORDS"] = True
                    errors.append(item)
                    errorsObj["WRONG_COORDS"].append({"row": i + 1, "error": err})
    except Exception as e:
        print("Validate Data error: ", str(e))
        return False, 0, errors, str(e), errorsObj
    return (runs > 0 and len(errors) == 0, len(errors), errors, None, errorsObj)


def align_data_old_to_new(old_data_path, new_data_path) -> tuple[bool, str]:
    try:
        with open(MATCH_PATTERN, "r") as file_obj:
            match_pattern = {}
            for line in file_obj.readlines()[1:]:
                line = line.replace("\n", "")
                k, v = line.split(DELIMITER)[0], line.split(DELIMITER)[1]
                match_pattern[k] = v
            with open(new_data_path, "w") as f:
                f.write(NEW_DATA_HEADER)
                with open(old_data_path, "r") as g:
                    old_data = csv.DictReader(g, delimiter="|")
                    for row in tqdm(
                        list(old_data), unit=" rows", desc="Aligning Data ... "
                    ):
                        new_data_row = {}
                        for k, v in match_pattern.items():
                            if v in row.keys():
                                new_data_row[k] = str(row[v]).replace("\n", "")
                            else:
                                new_data_row[k] = ""
                        f.write("\n" + DELIMITER.join(new_data_row.values()))
        return True, None
    except Exception as e:
        print("ERROR: ", traceback.format_exc())
        return False, str(e)


def load_data_from_csv(csv_file_path):
    conn = get_connection()
    try:
        with open(csv_file_path) as file_obj:
            reader_obj = csv.DictReader(file_obj, delimiter="|")
            dataset_id = load_dataset_data(conn)
            bio_id = None
            ir_id = None
            occ_id = None
            for row in tqdm(list(reader_obj), unit=" rows", desc="Uploading Data ... "):
                occ_id = load_occurrence(conn, dataset_id, row)
                if "bio_data" in row.keys():
                    if row["bio_data"] == "yes":
                        bio_id = load_bionomics(conn, dataset_id, row)
                        query = template_occurrence_update_bio_data.format(
                            bionomicsId=bio_id, occ_id=occ_id
                        )
                        run_query(conn, query)
                elif "bio data" in row.keys():
                    if row["bio data"] == "yes":
                        bio_id = load_bionomics(conn, dataset_id, row)
                        query = template_occurrence_update_bio_data.format(
                            bionomicsId=bio_id, occ_id=occ_id
                        )
                        run_query(conn, query)
                if "IR data" in row.keys():
                    if row["IR data"] != "none":
                        ir_id = load_resistance(conn, dataset_id, row)
                        query = template_occurrence_update_ir_data.format(
                            insecticideResistanceBioassaysId=ir_id, occ_id=occ_id
                        )
                        run_query(conn, query)
                elif "insecticide_resistance_data" in row.keys():
                    if row["insecticide_resistance_data"] != "none":
                        ir_id = load_resistance(conn, dataset_id, row)
                        query = template_occurrence_update_ir_data.format(
                            insecticideResistanceBioassaysId=ir_id, occ_id=occ_id
                        )
                        run_query(conn, query)
            conn.commit()
            conn.close()
        return True
    except Exception as e:
        print("Loading exception: ", e)
        print("ERROR: ", traceback.format_exc())
        conn.rollback()
        return False


def load_occurrence(conn, dataset_id: str, datarow: dict) -> str:
    refid = load_reference_data(conn, datarow)
    site_id = load_site_data(conn, datarow)
    specie_id = load_specie_data(conn, datarow)
    sampling_id = load_sampling_method_data(conn, datarow)
    occ_id = get_uuid()
    query = template_insert_occurrence_data.format(
        id=occ_id,
        month_start=get_int_key_val(datarow, "month_start"),
        year_start=get_int_key_val(datarow, "year_start"),
        month_end=get_int_key_val(datarow, "month_end"),
        year_end=get_int_key_val(datarow, "year_end"),
        dec_id="",  # ?datarow[""],
        dec_check="",  # ?datarow[""],
        map_check="",  # ?datarow[""],
        vector_notes="",  # ?datarow[""],
        referenceId=refid,
        siteId=site_id,
        recordedSpeciesId=specie_id,
        sampleId=sampling_id,
        timestamp_start=datetime_from_month_year(
            month=datarow["month_start"], year=datarow["year_start"]
        ),  # datarow[""],
        timestamp_end=datetime_from_month_year(
            month=datarow["month_end"], year=datarow["year_end"]
        ),  # datarow[""],
        datasetId=dataset_id,  # ?datarow[""],
        download_count=0,
        insecticide_resistance_data=get_string_key_val(datarow, "insecticide_resistance_data"),
        binary_presence=get_bool_key_val(datarow, "binary_presence"),
        larval_data=get_bool_key_val(datarow, "larval_data"),
        abundance_data=get_bool_key_val(datarow, "abundance_data_in_a_graph"),
        pheno_data=get_bool_key_val(datarow, "pheno_data"),
        geno_data=get_bool_key_val(datarow, "geno_data"),
        confidentiality_status=get_string_key_val(datarow, "confidentiality_status"),
        source_id=get_string_key_val(datarow, "source_id"),
        bio_data=get_string_key_val(datarow, "bio_data"),
        personal_communication=get_string_key_val(datarow, "personal_communication"),
        source_notes=get_string_key_val(datarow, "source_notes"),
    )
    run_query(conn, query)
    return occ_id


def load_bionomics(conn, dataset_id: str, datarow: dict) -> str:
    ref_id = load_reference_data(conn, datarow)
    site_id = load_site_data(conn, datarow)
    biology_id = load_biology_data(conn, datarow)
    infection_id = load_infection_data(conn, datarow)
    biting_activity_id = load_biting_activity_data(conn, datarow)
    biting_rate_id = load_biting_rate_data(conn, datarow)
    anthropozoophagic_id = load_anthropozoophagic_data(conn, datarow)
    endoexophagic_id = load_endoexophagic_data(conn, datarow)
    endoexophily_id = load_endoexophily_data(conn, datarow)
    environment_id = load_environment_data(conn, datarow)
    dataset_id = dataset_id
    larva_site_id = load_larvae_habitat_data(conn, datarow)
    bio_id = get_uuid()
    query = template_insert_bionomics_data.format(
        id=bio_id,
        adult_data=get_bool_key_val(datarow, "adult_data"),
        larval_site_data=get_bool_key_val(datarow, "larval_site_data"),
        contact_authors=get_bool_key_val(datarow, "contact_authors"),
        contact_notes=get_string_key_val(datarow, "source_notes"),
        secondary_info=get_string_val(""),
        insecticide_control=get_bool_key_val(datarow, "insecticide_control"),
        control=get_string_key_val(datarow, "control_type"),
        month_start=get_int_key_val(datarow, "month_start"),
        year_start=get_int_key_val(datarow, "year_start"),
        month_end=get_int_key_val(datarow, "month_end"),
        year_end=get_int_key_val(datarow, "year_end"),
        season_given=get_string_key_val(datarow, "season_given"),
        season_calc=get_string_key_val(datarow, "season_calc"),
        data_abstracted_by=get_string_key_val(datarow, "data_abstracted_by"),
        data_checked_by=get_string_key_val(datarow, "data_checked_by"),
        control_notes=get_string_key_val(datarow, "control_notes"),
        season_notes=get_string_key_val(datarow, "season_notes"),
        referenceId=ref_id,
        siteId=site_id,
        biologyId=biology_id,
        infectionId=infection_id,
        bitingRateId=biting_rate_id,
        anthropoZoophagicId=anthropozoophagic_id,
        endoExophagicId=endoexophagic_id,
        bitingActivityId=biting_activity_id,
        endoExophilyId=endoexophily_id,
        study_sampling_design=get_string_key_val(datarow, "study_sampling_design"),
        itn_use=get_bool_key_val(datarow, "itn_use"),
        environmentId=environment_id,
        # timestamp_start = "",
        # timestamp_end = "",
        datasetId=dataset_id,
        ir_data=get_string_key_val(datarow, "insecticide_resistance_data"),
        rainfall_time=get_string_key_val(datarow, "rainfall_time"),
        larvalSiteId=larva_site_id,
    )
    run_query(conn, query)
    return bio_id


def load_resistance(conn, dataset_id: str, datarow: dict) -> str:
    """extract ir relevant data from excel source and load to corresponding tables"""
    genotypicRepresentativenessId = load_genotypicRepresentativeness_data(conn, datarow)
    vgscMethodAndSampleId = load_vgscMethodAndSample_data(conn, datarow)
    vgscGeneytpeFrequenciesId = load_vgscGeneytpeFrequencies_data(conn, datarow)
    kdrGenotypeFrequenciesId = load_kdrGenotypeFrequencies_data(conn, datarow)
    vgsc995AlleleFrequenciesId = load_vgsc995AlleleFrequencies_data(conn, datarow)
    vgsc402GenotypeFrequenciesId = load_vgsc402GenotypeFrequencies_data(conn, datarow)
    vgsc402AlleleFrequenciesId = load_vgsc402AlleleFrequencies_data(conn, datarow)
    cyp6aapAlleleFrequenciesId = load_cyp6aapAlleleFrequencies_data(conn, datarow)
    cyp6aapGenotypeFrequenciesId = load_cyp6aapGenotypeFrequencies_data(conn, datarow)
    cyp6p4AlleleFrequenciesId = load_cyp6p4AlleleFrequencies_data(conn, datarow)
    cyp6p4GenotypeFrequenciesId = load_cyp6p4GenotypeFrequencies_data(conn, datarow)
    cyp4j5AlleleFrequenciesId = load_cyp4j5AlleleFrequencies_data(conn, datarow)
    cyp4j5GenotypeFrequenciesId = load_cyp4j5GenotypeFrequencies_data(conn, datarow)
    cytochromesP450CypMethodAndSampleId = load_cytochromesP450CypMethodAndSample_data(
        conn, datarow
    )
    gste2119AlleleFrequenciesId = load_gste2119AlleleFrequencies_data(conn, datarow)
    gste2119GenotypeFrequenciesId = load_gste2119GenotypeFrequencies_data(conn, datarow)
    gste2114AlleleFrequenciesId = load_gste2114AlleleFrequencies_data(conn, datarow)
    gste2114GenotypeFrequenciesId = load_gste2114GenotypeFrequencies_data(conn, datarow)
    vgsc1570GenotypeFrequenciesId = load_vgsc1570GenotypeFrequencies_data(conn, datarow)
    vgsc1570AlleleFrequenciesId = load_vgsc1570AlleleFrequencies_data(conn, datarow)
    rdlMethodAndSampleId = load_rdlMethodAndSample_data(conn, datarow)
    rdl296GenotypeFrequenciesId = load_rdl296GenotypeFrequencies_data(conn, datarow)
    rdl296AlleleFrequenciesId = load_rdl296AlleleFrequencies_data(conn, datarow)
    ace1MethodAndSampleId = load_ace1MethodAndSample_data(conn, datarow)
    ace1GenotypeFrequenciesId = load_ace1GenotypeFrequencies_data(conn, datarow)
    ace1AlleleFrequenciesId = load_ace1AlleleFrequencies_data(conn, datarow)
    gsteMethodAndSampleId = load_gsteMethodAndSample_data(conn, datarow)
    # load resistance record
    ir_id = get_uuid()
    query = template_insert_ir_data.format(
        id=ir_id,
        bio_rep_complex_site=get_string_key_val(
            datarow, "bioassay_representative_of_complex_at_site"
        ),
        bio_rep_complex_site_disaggregated=get_string_key_val(
            datarow,
            "bioassay_representative_of_complex_at_site_if_disaggregated_values_combined_without_adjustments",
        ),
        generation=get_string_key_val(datarow, "generation"),
        wild_caught_larvae_adults=get_string_key_val(
            datarow, "wild_caught_larvae_or_adults"
        ),
        lower_age_days=get_string_key_val(datarow, "lower_age_days"),
        upper_age_days=get_string_key_val(datarow, "upper_age_days"),
        test_protocol=get_string_key_val(datarow, "test_protocol"),
        insecticide_tested=get_string_key_val(datarow, "insecticide_tested"),
        insecticide_class=get_string_key_val(datarow, "insecticide_class"),
        irac_moa=get_string_key_val(datarow, "irac_moa"),
        irac_moa_code=get_string_key_val(datarow, "irac_moa_code"),
        concentration_percent=get_string_key_val(datarow, "concentration_percent"),
        concentration_micrograms=get_string_key_val(datarow, "concentration_micrograms"),
        exposure_period_min=get_string_key_val(datarow, "exposure_period_min"),
        intensity_multiplier=get_string_key_val(datarow, "intensity_multiplier"),
        synergist_tested=get_string_key_val(datarow, "synergist_tested"),
        synergist_concentration=get_string_key_val(datarow, "synergist_concentration"),
        synergist_concentration_unit=get_string_key_val(
            datarow, "synergist_concentration_unit"
        ),
        mosquitoes_tested_n=get_string_key_val(datarow, "mosquitoes_tested_n"),
        mosquitoes_dead_n=get_string_key_val(datarow, "mosquitoes_dead_n"),
        percent_mortality=get_string_key_val(datarow, "percent_mortality"),
        knock_down_exposure_time_min=get_string_key_val(
            datarow, "knock_down_exposure_time_min"
        ),
        mosquitoes_knocked_down_n=get_string_key_val(datarow, "mosquitoes_knocked_down_n"),
        knock_down_percent=get_string_key_val(datarow, "knock_down_percent"),
        kdt_50_percent_min=get_string_key_val(datarow, "kdt_50_percent_min"),
        kdt_90_percent_min=get_string_key_val(datarow, "kdt_90_percent_min"),
        kdt_95_percent_min=get_string_key_val(datarow, "kdt_95_percent_min"),
        bioassay_notes=get_string_key_val(datarow, "bioassay_notes"),
        genotypicRepresentativenessId=genotypicRepresentativenessId,
        vgscMethodAndSampleId=vgscMethodAndSampleId,
        vgscGeneytpeFrequenciesId=vgscGeneytpeFrequenciesId,
        kdrGenotypeFrequenciesId=kdrGenotypeFrequenciesId,
        vgsc995AlleleFrequenciesId=vgsc995AlleleFrequenciesId,
        vgsc402GenotypeFrequenciesId=vgsc402GenotypeFrequenciesId,
        vgsc402AlleleFrequenciesId=vgsc402AlleleFrequenciesId,
        cyp6aapAlleleFrequenciesId=cyp6aapAlleleFrequenciesId,
        cyp6aapGenotypeFrequenciesId=cyp6aapGenotypeFrequenciesId,
        cyp6p4AlleleFrequenciesId=cyp6p4AlleleFrequenciesId,
        cyp6p4GenotypeFrequenciesId=cyp6p4GenotypeFrequenciesId,
        cyp4j5AlleleFrequenciesId=cyp4j5AlleleFrequenciesId,
        cyp4j5GenotypeFrequenciesId=cyp4j5GenotypeFrequenciesId,
        cytochromesP450CypMethodAndSampleId=cytochromesP450CypMethodAndSampleId,
        gste2119AlleleFrequenciesId=gste2119AlleleFrequenciesId,
        gste2119GenotypeFrequenciesId=gste2119GenotypeFrequenciesId,
        gste2114AlleleFrequenciesId=gste2114AlleleFrequenciesId,
        gste2114GenotypeFrequenciesId=gste2114GenotypeFrequenciesId,
        vgsc1570GenotypeFrequenciesId=vgsc1570GenotypeFrequenciesId,
        vgsc1570AlleleFrequenciesId=vgsc1570AlleleFrequenciesId,
        rdlMethodAndSampleId=rdlMethodAndSampleId,
        rdl296GenotypeFrequenciesId=rdl296GenotypeFrequenciesId,
        rdl296AlleleFrequenciesId=rdl296AlleleFrequenciesId,
        ace1MethodAndSampleId=ace1MethodAndSampleId,
        ace1GenotypeFrequenciesId=ace1GenotypeFrequenciesId,
        ace1AlleleFrequenciesId=ace1AlleleFrequenciesId,
        gsteMethodAndSampleId=gsteMethodAndSampleId,
    )
    run_query(conn, query)
    return ir_id


# occurrence data management
def load_reference_data(conn, data_row) -> str:
    citation = get_string_key_val(data_row, "citation_doi")
    year = get_int_key_val(data_row, "publication_year")

    _record_exist = record_exist(
        conn,
        query=template_select_reference_data.format(
            year=year,
            citation=citation,
        ),
    )

    if _record_exist:
        return _record_exist
    else:
        id = str(get_uuid())
        author = get_string_key_val(data_row, "author")
        article_title = get_string_key_val(data_row, "article_title")
        journal_title = get_string_key_val(data_row, "journal_title")
        published = get_bool_val("no")
        report_type = ""
        v_data = get_bool_val("no")

        query = """
        INSERT INTO public.reference (
            id, author, article_title, journal_title, citation, "year", published, report_type, v_data
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
        """

        params = (
            id,
            author,
            article_title,
            journal_title,
            citation,
            year,
            published,
            report_type,
            v_data,
        )

        run_query(conn, query, params)
        return id


def load_site_data(conn, data_row) -> str:
    _record_exist = record_exist(
        conn,
        query=template_select_site_data.format(
            # country = get_string_key_val(data_row, "country"]).replace("'", " ").lower(),
            latitude=get_float_key_val(data_row, "latitude_1"),
            longitude=get_float_key_val(data_row, "longitude_1"),
        ),
    )
    if _record_exist:
        return _record_exist
    else:
        id = get_uuid()
        query = template_insert_site_data.format(
            id=id,
            country=get_string_key_val(data_row, "country"),
            georef_source=get_string_key_val(data_row, "georef_source"),
            latitude=get_float_key_val(data_row, "latitude_1"),
            longitude=get_float_key_val(data_row, "longitude_1"),
            latitude_2=get_float_key_val(data_row, "latitude_2"),
            longitude_2=get_float_key_val(data_row, "longitude_2"),
            site_notes=get_string_key_val(data_row, "site_notes"),
            area_type=get_string_key_val(data_row, "area_type"),
            site=get_string_key_val(data_row, "site"),
            latitude_3=get_float_key_val(data_row, "latitude_3"),
            longitude_3=get_float_key_val(data_row, "longitude_3"),
            latitude_4=get_float_key_val(data_row, "latitude_4"),
            longitude_4=get_float_key_val(data_row, "longitude_4"),
            latitude_5=get_float_key_val(data_row, "latitude_5"),
            longitude_5=get_float_key_val(data_row, "longitude_5"),
            latitude_6=get_float_key_val(data_row, "latitude_6"),
            longitude_6=get_float_key_val(data_row, "longitude_6"),
            latitude_7=get_float_key_val(data_row, "latitude_7"),
            longitude_7=get_float_key_val(data_row, "longitude_7"),
            latitude_8=get_float_key_val(data_row, "latitude_8"),
            longitude_8=get_float_key_val(data_row, "longitude_8"),
            confidence_in_georef=get_string_key_val(data_row, "confidence_in_georef"),
            admin_level_1=0,  # ?get_string_key_val(data_row, "admin level_1"]),
            admin_level_2=get_string_key_val(data_row, "admin_level_2"),
        )
        run_query(conn, query)
        return id


def load_specie_data(conn, data_row) -> str:
    _record_exist = record_exist(
        conn,
        query=template_select_specie_data.format(
            species=get_string_key_val(data_row, "species"),
        ),
    )
    # print(f"RECORD EXIST:::: {_record_exist}")
    if _record_exist:
        return _record_exist
    else:
        id = get_uuid()
        query = template_insert_specie_data.format(
            id=id,
            species_notes=get_string_key_val(data_row, "species_notes"),
            species=get_string_key_val(data_row, "species"),
            species_id_1=get_string_key_val(data_row, "species_id_1"),
            species_id_2=get_string_key_val(data_row, "species_id_2"),
        )
        run_query(conn, query)
        return id


def load_sampling_method_data(conn, data_row) -> str:
    # TODO: avoid data duplication
    id = get_uuid()
    query = template_insert_sample_method_data.format(
        id=id,
        control=get_bool_key_val(data_row, "insecticide_control"),
        control_type=get_string_key_val(data_row, "control_type"),
        sampling_occurrence_1=get_string_key_val(data_row, "sampling_occurrence_1"),
        occurrence_n_1=get_int_key_val(data_row, "occurrence_n_1"),
        sampling_occurrence_2=get_string_key_val(data_row, "sampling_occurrence_2"),
        occurrence_n_2=get_int_key_val(data_row, "occurrence_n_2"),
        sampling_occurrence_3=get_string_key_val(data_row, "sampling_occurrence_3"),
        occurrence_n_3=get_int_key_val(data_row, "occurrence_n_3"),
        sampling_occurrence_4=get_string_key_val(data_row, "sampling_occurrence_4"),
        occurrence_n_4=get_int_key_val(data_row, "occurrence_n_4"),
        occurrence_n_total=get_int_key_val(data_row, "occurrence_n_total"),
        occurrence_notes=get_string_key_val(data_row, "occurrence_notes"),
    )
    run_query(conn, query)
    return id


def load_dataset_data(conn) -> str:
    id = get_uuid()
    query = template_insert_dataset_data.format(
        id=id,
        status=get_string_val(""),
        UpdatedBy=get_string_val("Script"),
        UpdatedAt=datetime.datetime.now(),
        doi=get_string_val(""),
    )
    run_query(conn, query)
    return id


def load_vectorinfo_data(conn, data_row) -> str:
    return ""


def load_insecticide_practice_data(conn, data_row) -> str:
    return ""


def load_insecticide_info_data(conn, data_row) -> str:
    return ""


def load_environment_data(conn, data_row) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_environment_data.format(
        id=id,
        roof=get_string_key_val(data_row, "roof"),
        walls=get_string_key_val(data_row, "walls"),
        house_screening=get_bool_key_val(data_row, "house_screening"),
        open_eaves=get_bool_key_val(data_row, "open_eaves"),
        cooking=get_string_key_val(data_row, "cooking"),
        sleeping_outdoors=get_bool_key_val(data_row, "sleeping_outdoors"),
        farming=get_string_key_val(data_row, "farming"),
        local_plants=get_string_key_val(data_row, "local_plants"),
        housing_notes=get_string_key_val(data_row, "housing_notes"),
        community_notes=get_string_key_val(data_row, "community_notes"),
        farming_notes=get_string_key_val(data_row, "farming_notes"),
        livestock_notes=get_string_key_val(data_row, "livestock_notes"),
        common_occupation_1=get_string_key_val(data_row, "common_occupation_1"),
        common_occupation_2=get_string_key_val(data_row, "common_occupation_2"),
        common_occupation_3=get_string_key_val(data_row, "common_occupation_3"),
        outdoor_timings_hours=get_string_key_val(data_row, "outdoor_timings_hours"),
        outdoor_activities_notes=get_string_key_val(
            data_row, "outdoor_activities_notes"
        ),
        average_bedtime=get_string_key_val(data_row, "average_bedtime"),
        average_wake_time=get_string_key_val(data_row, "average_wake_time"),
        time_people_leave_home_in_morning=get_string_key_val(
            data_row, "time_people_leave_home_in_morning"
        ),
        hours_spent_away_from_home_per_day=get_string_key_val(data_row, "hours_spent_away_from_home_per_day"),
        seasonal_labour=get_string_key_val(data_row, "seasonal_labour"),
        livestock_1=get_string_key_val(data_row, "livestock_1"),
        livestock_2=get_string_key_val(data_row, "livestock_2"),
        livestock_3=get_string_key_val(data_row, "livestock_3"),
        livestock_4=get_string_key_val(data_row, "livestock_4"),
        environment_notes=get_string_key_val(data_row, "environment_notes"),
        outdoor_activities_at_night=get_string_key_val(
            data_row, "outdoor_activities_at_night"
        ),
        forest=get_string_key_val(data_row, "forest"),
    )
    run_query(conn, query)
    return id


# bionomics datamanagement


def load_larvae_habitat_data(conn, data_row) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_larvasite_data.format(
        id=id,
        larval_instars_found_1=get_string_key_val(data_row, "larval_instars_found_1"),
        larval_habitat_1=get_string_key_val(data_row, "larval_habitat_1"),
        larval_site_character_1=get_string_key_val(data_row, "larval_site_character_1"),
        larval_turbidity_1=get_string_key_val(data_row, "larval_turbidity_1"),
        larval_salinity_1=get_string_key_val(data_row, "larval_salinity_1"),
        larval_vegetation_1=get_string_key_val(data_row, "larval_vegetation_1"),
        larval_shade_1=get_string_key_val(data_row, "larval_shade_1"),
        larval_water_current_1=get_string_key_val(data_row, "larval_water_current_1"),
        larval_size_1=get_string_key_val(data_row, "larval_size_1"),
        larval_depth_1=get_string_key_val(data_row, "larval_depth_1"),
        larval_permanence_1=get_string_key_val(data_row, "larval_permanence_1"),
        larval_other_fauna_1=get_string_key_val(data_row, "larval_other_fauna_1"),
        larval_control_present_1=get_string_key_val(
            data_row, "larval_control_present_1"
        ),
        larval_instars_found_2=get_string_key_val(data_row, "larval_instars_found_2"),
        larval_habitat_2=get_string_key_val(data_row, "larval_habitat_2"),
        larval_site_character_2=get_string_key_val(data_row, "larval_site_character_2"),
        larval_turbidity_2=get_string_key_val(data_row, "larval_turbidity_2"),
        larval_salinity_2=get_string_key_val(data_row, "larval_salinity_2"),
        larval_vegetation_2=get_string_key_val(data_row, "larval__vegetation_2"),
        larval_shade_2=get_string_key_val(data_row, "larval_shade_2"),
        larval_water_current_2=get_string_key_val(data_row, "larval_water_current_2"),
        larval_size_2=get_string_key_val(data_row, "larval_size_2"),
        larval_depth_2=get_string_key_val(data_row, "larval_depth_2"),
        larval_permanence_2=get_string_key_val(data_row, "larval_permanence_2"),
        larval_other_fauna_2=get_string_key_val(data_row, "larval_other_fauna_2"),
        larval_control_present_2=get_string_key_val(
            data_row, "larval_control_present_2"
        ),
        larval_instars_found_3=get_string_key_val(data_row, "larval_instars_found_3"),
        larval_habitat_3=get_string_key_val(data_row, "larval_habitat_3"),
        larval_site_character_3=get_string_key_val(data_row, "larval_site_character_3"),
        larval_turbidity_3=get_string_key_val(data_row, "larval_turbidity_3"),
        larval_salinity_3=get_string_key_val(data_row, "larval_salinity_3"),
        larval_vegetation_3=get_string_key_val(data_row, "larval_vegetation_3"),
        larval_shade_3=get_string_key_val(data_row, "larval_shade_3"),
        larval_water_current_3=get_string_key_val(data_row, "larval_water_current_3"),
        larval_size_3=get_string_key_val(data_row, "larval_size_3"),
        larval_depth_3=get_string_key_val(data_row, "larval_depth_3"),
        larval_permanence_3=get_string_key_val(data_row, "larval_permanence_3"),
        larval_other_fauna_3=get_string_key_val(data_row, "larval_other_fauna_3"),
        larval_control_present_3=get_string_key_val(
            data_row, "larval_control_present_3"
        ),
        larval_notes=get_string_key_val(data_row, "larval_notes"),
    )
    run_query(conn, query)
    return id


def load_biology_data(conn, data_row) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_biology_data.format(
        id=id,
        sampling_biology_1=get_string_key_val(data_row, "sampling_biology_1"),
        sampling_biology_2=get_string_key_val(data_row, "sampling_biology_2"),
        sampling_biology_3=get_string_key_val(data_row, "sampling_biology_3"),
        sampling_biology_n=get_string_key_val(data_row, "sampling_biology_n"),
        parity_n=get_float_key_val(data_row, "parity_n"),
        parity_total=get_float_key_val(data_row, "parity_total"),
        parity_percent=get_float_key_val(data_row, "parity_percent"),
        daily_survival_rate=get_float_key_val(data_row, "daily_survival_rate_percent"),
        fecundity_mean_batch_size=get_float_key_val(data_row, "fecundity_mean_batch_size"),
        gonotrophic_cycle_days=get_float_key_val(data_row, "gonotrophic_cycle_days"),
        biology_notes=get_string_key_val(data_row, "biology_notes"),
    )
    run_query(conn, query)
    return id


def load_biting_activity_data(conn, data_row) -> str:
    id = get_uuid()
    query = template_insert_biting_activity_data.format(
        id=id,
        biting_activity_indoor_number_of_sampling_nights=get_int_key_val(
            data_row, "biting_activity_indoor_number_of_sampling_nights"
        ),
        _18_30_21_30_indoor=get_int_key_val(data_row, "1830_2130_in"),
        _21_30_00_30_indoor=get_int_key_val(data_row, "2130_0030_in"),
        _00_30_03_30_indoor=get_int_key_val(data_row, "0030_0330_in"),
        _03_30_06_30_indoor=get_int_key_val(data_row, "0330_0630_in"),
        biting_activity_outdoor_number_of_sampling_nights=get_int_key_val(
            data_row, "biting_activity_outdoor_number_of_sampling_nights"
        ),
        _18_30_21_30_outdoor=get_int_key_val(data_row, "1830_2130_out"),
        _21_30_00_30_outdoor=get_int_key_val(data_row, "2130_0030_out"),
        _00_30_03_30_outdoor=get_int_key_val(data_row, "0030_0330_out"),
        _03_30_06_30_outdoor=get_int_key_val(data_row, "0330_0630_out"),
        biting_activity_combined_number_of_sampling_nights=get_int_key_val(
            data_row, "biting_activity_combined_number_of_sampling_nights"
        ),
        _18_30_21_30_combined=get_int_key_val(data_row, "1830_2130_combined"),
        _21_30_00_30_combined=get_int_key_val(data_row, "2130_0030_combined"),
        _00_30_03_30_combined=get_int_key_val(data_row, "0030_0330_combined"),
        _03_30_06_30_combined=get_int_key_val(data_row, "0330_0630_combined"),
        notes=get_string_key_val(data_row, "biting_notes"),
        _18_00_19_00_indoor=get_int_key_val(data_row, "1800_1900_in"),
        _19_00_20_00_indoor=get_int_key_val(data_row, "1900_2000_in"),
        _20_00_21_00_indoor=get_int_key_val(data_row, "2000_2100_in"),
        _21_00_22_00_indoor=get_int_key_val(data_row, "2100_2200_in"),
        _22_00_23_00_indoor=get_int_key_val(data_row, "2200_2300_in"),
        _23_00_00_00_indoor=get_int_key_val(data_row, "2300_0000_in"),
        _00_00_01_00_indoor=get_int_key_val(data_row, "0000_0100_in"),
        _01_00_02_00_indoor=get_int_key_val(data_row, "0100_0200_in"),
        _02_00_03_00_indoor=get_int_key_val(data_row, "0200_0300_in"),
        _03_00_04_00_indoor=get_int_key_val(data_row, "0300_0400_in"),
        _04_00_05_00_indoor=get_int_key_val(data_row, "0400_0500_in"),
        _05_00_06_00_indoor=get_int_key_val(data_row, "0500_0600_in"),
        _18_00_19_00_combined=get_int_key_val(data_row, "1800_1900_combined"),
        _19_00_20_00_combined=get_int_key_val(data_row, "1900_2000_combined"),
        _20_00_21_00_combined=get_int_key_val(data_row, "2000_2100_combined"),
        _21_00_22_00_combined=get_int_key_val(data_row, "2100_2200_combined"),
        _22_00_23_00_combined=get_int_key_val(data_row, "2200_2300_combined"),
        _23_00_00_00_combined=get_int_key_val(data_row, "2300_0000_combined"),
        _00_00_01_00_combined=get_int_key_val(data_row, "0000_0100_combined"),
        _01_00_02_00_combined=get_int_key_val(data_row, "0100_0200_combined"),
        _02_00_03_00_combined=get_int_key_val(data_row, "0200_0300_combined"),
        _03_00_04_00_combined=get_int_key_val(data_row, "0300_0400_combined"),
        _04_00_05_00_combined=get_int_key_val(data_row, "0400_0500_combined"),
        _05_00_06_00_combined=get_int_key_val(data_row, "0500_0600_combined"),
        _18_00_19_00_outdoor=get_int_key_val(data_row, "1800_1900_out"),
        _19_00_20_00_outdoor=get_int_key_val(data_row, "1900_2000_out"),
        _20_00_21_00_outdoor=get_int_key_val(data_row, "2000_2100_out"),
        _21_00_22_00_outdoor=get_int_key_val(data_row, "2100_2200_out"),
        _22_00_23_00_outdoor=get_int_key_val(data_row, "2200_2300_out"),
        _23_00_00_00_outdoor=get_int_key_val(data_row, "2300_0000_out"),
        _00_00_01_00_outdoor=get_int_key_val(data_row, "0000_0100_out"),
        _01_00_02_00_outdoor=get_int_key_val(data_row, "0100_0200_out"),
        _02_00_03_00_outdoor=get_int_key_val(data_row, "0200_0300_out"),
        _03_00_04_00_outdoor=get_int_key_val(data_row, "0300_0400_out"),
        _04_00_05_00_outdoor=get_int_key_val(data_row, "0400_0500_out"),
        _05_00_06_00_outdoor=get_int_key_val(data_row, "0500_0600_out"),
    )
    run_query(conn, query)
    return id


def load_bitting_peak_data(conn, data_row) -> str:
    return ""


def load_biting_rate_data(conn, data_row) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_bitting_rate_data.format(
        id=id,
        hbr_sampling_indoor=get_string_key_val(data_row, "hbr_sampling_indoor"),
        hbr_sampling_outdoor=get_string_key_val(data_row, "hbr_sampling_outdoor"),
        hbr_sampling_combined_1=get_string_key_val(data_row, "hbr_sampling_combined_1"),
        hbr_sampling_combined_2=get_string_key_val(data_row, "hbr_sampling_combined_2"),
        hbr_sampling_combined_3=get_string_key_val(data_row, "hbr_sampling_combined_3"),
        hbr_sampling_combined_n=get_string_key_val(data_row, "hbr_sampling_combined_n"),
        hbr_unit=get_string_key_val(data_row, "hbr_unit"),
        abr_sampling_combined_1=get_string_key_val(data_row, "abr_sampling_1"),
        abr_sampling_combined_2=get_string_key_val(data_row, "abr_sampling_2"),
        abr_sampling_combined_3=get_string_key_val(data_row, "abr_sampling_3"),
        abr_sampling_combined_n=get_string_key_val(data_row, "abr_sampling_n"),
        abr_unit=get_string_key_val(data_row, "abr_unit"),
        indoor_hbr=get_float_key_val(data_row, "indoor_hbr"),
        outdoor_hbr=get_float_key_val(data_row, "outdoor_hbr"),
        combined_hbr=get_float_key_val(data_row, "combined_hbr"),
        abr=get_float_key_val(data_row, "abr"),
        biting_rate_notes=get_string_key_val(data_row, "biting_rate_notes"),
    )
    run_query(conn, query)
    return id


def load_bitting_location_data(conn, data_row) -> str:
    return ""


def load_resting_pref_data(conn, data_row) -> str:
    return ""


def load_host_pref_data(conn, data_row) -> str:
    return ""


def load_infection_data(conn, data_row) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_infection_data.format(
        id=id,
        sampling_infection_1=get_string_key_val(data_row, "sampling_infection_1"),
        sampling_infection_2=get_string_key_val(data_row, "sampling_infection_2"),
        sampling_infection_3=get_string_key_val(data_row, "sampling_infection_3"),
        sampling_infection_n=get_string_key_val(data_row, "sampling_infection_n"),
        sporozoite_rate_by_csp_n_pool=get_int_val(0),
        sporozoite_rate_by_csp_total_pool=get_int_val(0),
        no_per_pool=get_int_val(0),
        sporozoite_rate_by_dissection_n=get_int_key_val(data_row, "sporozoite_rate_by_dissection_n"),
        sporozoite_rate_by_dissection_total=get_int_key_val(
            data_row, "sporozoite_rate_by_dissection_total"
        ),
        sporozoite_rate_by_csp_n=get_int_key_val(data_row, "sporozoite_rate_by_csp_n_pool"),
        sporozoite_rate_by_csp_total=get_int_key_val(data_row, "sporozoite_rate_by_csp_total_pool"),
        sporozoite_rate_p_falciparum_total=get_int_key_val(data_row, "sporozoite_rate_p_falciparum_total"),
        sporozoite_rate_p_falciparum_n=get_int_key_val(data_row, "sporozoite_rate_p_falciparum_n"),
        oocyst_n=get_int_key_val(data_row, "oocyst_n"),
        oocyst_total=get_int_key_val(data_row, "oocyst_total"),
        eir_period=get_string_key_val(data_row, "eir_period"),
        ir_by_csp_perc=get_float_key_val(data_row, "sporozoite_rate_by_csp_percent"),
        sporozoite_rate_by_dissection_percent=get_float_key_val(
            data_row, "sporozoite_rate_by_dissection_percent"
        ),
        sporozoite_rate_by_csp_percent=get_float_key_val(data_row, "sporozoite_rate_by_csp_percent"),
        sporozoite_rate_p_falciparum_percent=get_float_key_val(
            data_row, "sporozoite_rate_p_falciparum_n"
        ),
        oocyst_rate_percent=get_float_key_val(data_row, "oocyst_rate_percent"),
        eir=get_float_val(0),
        eir_days=get_int_val(0),  # data_row["eir_period"]
        infection_notes=get_string_key_val(data_row, "infection_notes"),
        sporozoite_rate_p_vivax_n=get_int_key_val(data_row, "sporozoite_rate_p_vivax_n"),
        sporozoite_rate_p_vivax_total=get_int_key_val(data_row, "sporozoite_rate_p_vivax_total"),
        sporozoite_rate_p_vivax_percent=get_float_key_val(data_row, "sporozoite_rate_p_vivax_percent"),
    )
    run_query(conn, query)
    return id


def load_anthropozoophagic_data(conn, data_row) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_anthropozoophagic_data.format(
        id=id,
        host_sampling_indoor=get_string_key_val(data_row, "host_sampling_indoor"),
        indoor_host_n=get_int_key_val(data_row, "indoor_host_n"),
        host_sampling_outdoor=get_string_key_val(data_row, "host_sampling_outdoor"),
        outdoor_host_n=get_int_key_val(data_row, "outdoor_host_n"),
        host_sampling_combined_1=get_string_key_val(
            data_row, "host_sampling_combined_1"
        ),
        host_sampling_combined_2=get_string_key_val(
            data_row, "host_sampling_combined_2"
        ),
        host_sampling_combined_3=get_string_key_val(
            data_row, "host_sampling_combined_3"
        ),
        host_sampling_combined_n=get_string_key_val(
            data_row, "host_sampling_combined_n"
        ),
        combined_host_n=get_int_key_val(data_row, "combined_host_n"),
        host_unit=get_string_key_val(data_row, "host_unit"),
        host_sampling_other_1=get_string_key_val(data_row, "host_sampling_other_1"),
        host_sampling_other_2=get_string_key_val(data_row, "host_sampling_other_2"),
        host_sampling_other_3=get_string_key_val(data_row, "host_sampling_other_3"),
        host_sampling_other_n=get_string_key_val(data_row, "host_sampling_other_n"),
        other_host_n=get_int_key_val(data_row, "other_host_n"),
        other_host_total=get_int_key_val(data_row, "other_host_total"),
        host_other_unit=get_string_key_val(data_row, "host_other_unit"),
        indoor_host_perc=get_float_key_val(data_row, "indoor_host_percent"),
        outdoor_host_perc=get_float_key_val(data_row, "outdoor_host_percent"),
        combined_host=get_float_key_val(data_row, "combined_host"),
        host_other=get_float_key_val(data_row, "host_other"),
        host_notes=get_string_key_val(data_row, "host_notes"),
        indoor_host_total=get_float_key_val(data_row, "indoor_host_total"),
        outdoor_host_total=get_float_key_val(data_row, "outdoor_host_total"),
        combined_host_total=get_float_key_val(data_row, "combined_host_total"),
    )
    run_query(conn, query)
    return id


def load_endoexophagic_data(conn, data_row) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_endoexophagic_data.format(
        id=id,
        sampling_nights_no_indoor=get_int_key_val(
            data_row, "biting_number_of_sampling_nights_indoors"
        ),
        biting_sampling_indoor=get_string_key_val(data_row, "biting_sampling_indoor"),
        sampling_nights_no_outdoor=get_int_key_val(
            data_row, "biting_number_of_sampling_nights_outdoors"
        ),
        biting_sampling_outdoor=get_string_key_val(data_row, "biting_sampling_outdoor"),
        indoor_outdoor_biting_unit=get_float_key_val(data_row, "indoor_outdoor_biting_unit"),
        indoor_biting_n=get_float_key_val(data_row, "indoor_biting_n"),
        indoor_biting_total=get_float_key_val(data_row, "indoor_biting_total"),
        indoor_biting_data=get_float_key_val(data_row, "indoor_biting_data"),
        outdoor_biting_n=get_float_key_val(data_row, "outdoor_biting_n"),
        outdoor_biting_total=get_float_key_val(data_row, "outdoor_biting_total"),
        outdoor_biting_data=get_float_key_val(data_row, "outdoor_biting_data"),
        indoor_outdoor_biting_notes=get_string_key_val(data_row, "indoor_outdoor_biting_notes"),
    )
    run_query(conn, query)
    return id


def load_endoexophily_data(conn, data_row) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_endoexophily_data.format(
        id=id,
        resting_sampling_indoor=get_string_key_val(data_row, "resting_sampling_indoor"),
        resting_sampling_outdoor=get_string_key_val(
            data_row, "resting_sampling_outdoor"
        ),
        resting_sampling_other=get_string_key_val(data_row, "resting_sampling_other"),
        resting_unit=get_string_key_val(data_row, "resting_unit"),
        unfed_indoor=get_float_key_val(data_row, "unfed_indoor"),
        fed_indoor=get_float_key_val(data_row, "fed_indoor"),
        gravid_indoor=get_float_key_val(data_row, "gravid_indoor"),
        total_indoor=get_float_key_val(data_row, "total_indoor"),
        unfed_outdoor=get_float_key_val(data_row, "unfed_outdoor"),
        fed_outdoor=get_float_key_val(data_row, "fed_outdoor"),
        gravid_outdoor=get_float_key_val(data_row, "gravid_outdoor"),
        total_outdoor=get_float_key_val(data_row, "total_outdoor"),
        unfed_other=get_float_key_val(data_row, "unfed_other"),
        fed_other=get_float_key_val(data_row, "fed_other"),
        gravid_other=get_float_key_val(data_row, "gravid_other"),
        total_other=get_float_key_val(data_row, "total_other"),
        resting_notes=get_string_key_val(data_row, "resting_notes"),
    )
    run_query(conn, query)
    return id


# insecticide_resistance_data management


def load_ir_bioassay_data(conn, data_row) -> str:
    return ""


def load_genetic_mechanism_link_data(conn, data_row) -> str:
    return ""


def load_gene_data(conn, data_row) -> str:
    return ""


def load_genotype_frequency_data(conn, data_row) -> str:
    return ""


def load_allele_frequency_data(conn, data_row) -> str:
    return ""


def load_genotypicRepresentativeness_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_genotypicRepresentativeness_data.format(
        id=id,
        genotypic_test_representative_of_species_at_site=get_string_key_val(
            datarow, "genotypic_test_representative_of_species_at_site"
        ),
        genotypic_test_representative_of_species_at_site_if_disaggregated_values_combined_without_adjustments=get_string_key_val(
            datarow,
            "genotypic_test_representative_of_species_at_site_if_disaggregated_values_combined_without_adjustments",
        ),
        minor_species_missing_allele_frequency_data=get_string_key_val(
            datarow, "minor_species_missing_allele_frequency_data"
        ),
        notes_on_population_representative=get_string_key_val(
            datarow, "notes_on_population_representative"
        ),
        genotypic_sample_first_been_through_bioassay_tests=get_string_key_val(
            datarow, "genotypic_sample_first_been_through_bioassay_tests"
        ),
        genotypic_sample_linked_to_a_specific_bioassay=get_string_key_val(
            datarow, "genotypic_sample_linked_to_a_specific_bioassay"
        ),
        bioassay_subsample_used_in_genotypic_test=get_string_key_val(
            datarow, "bioassay_subsample_used_in_genotypic_test"
        ),
        notes_on_bioassay_linkage=get_string_key_val(
            datarow, "notes_on_bioassay_linkage"
        ),
    )
    run_query(conn, query)
    return id


def load_vgscMethodAndSample_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_vgscmethodandsample_data.format(
        id=id,
        vgsc_method_1=get_string_key_val(datarow, "vgsc_method_1"),
        vgsc_method_2=get_string_key_val(datarow, "vgsc_method_2"),
        vgsc_number_of_mosquitoes_tested=get_string_key_val(
            datarow, "vgsc_number_of_mosquitoes_tested"
        ),
        vgsc_generation=get_string_key_val(datarow, "vgsc_generation"),
        vgsc_kdr_notes=get_string_key_val(datarow, "vgsc_kdr_notes"),
    )
    run_query(conn, query)
    return id


def load_vgscGeneytpeFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_vgscgeneytpefrequencies_data.format(
        id=id,
        vgsc995l_vgsc995l_n=get_string_key_val(datarow, "vgsc995l_vgsc995l_n"),
        vgsc995l_vgsc995l_percent=get_string_key_val(
            datarow, "vgsc995l_vgsc995l_percent"
        ),
        vgsc995l_vgsc995f_n=get_string_key_val(datarow, "vgsc995l_vgsc995f_n"),
        vgsc995l_vgsc995f_percent=get_string_key_val(
            datarow, "vgsc995l_vgsc995f_percent"
        ),
        vgsc995f_vgsc995f_n=get_string_key_val(datarow, "vgsc995f_vgsc995f_n"),
        vgsc995f_vgsc995f_percent=get_string_key_val(
            datarow, "vgsc995f_vgsc995f_percent"
        ),
        vgsc995l_vgsc995s_n=get_string_key_val(datarow, "vgsc995l_vgsc995s_n"),
        vgsc995l_vgsc995s_percent=get_string_key_val(
            datarow, "vgsc995l_vgsc995s_percent"
        ),
        vgsc995s_vgsc995s_n=get_string_key_val(datarow, "vgsc995s_vgsc995s_n"),
        vgsc995s_vgsc995s_percent=get_string_key_val(
            datarow, "vgsc995s_vgsc995s_percent"
        ),
        vgsc995l_vgsc995c_percent=get_string_key_val(
            datarow, "vgsc995l_vgsc995c_percent"
        ),
        vgsc995c_vgsc995c_n=get_string_key_val(datarow, "vgsc995c_vgsc995c_n"),
        vgsc995c_vgsc995c_percent=get_string_key_val(
            datarow, "vgsc995c_vgsc995c_percent"
        ),
        null_vgsc995c_or_vgsc995c_vgsc995c_n=get_string_key_val(
            datarow, "null_vgsc995c_or_vgsc995c_vgsc995c_n"
        ),
        null_vgsc995c_or_vgsc995c_vgsc995c_percent=get_string_key_val(
            datarow, "null_vgsc995c_or_vgsc995c_vgsc995c_percent"
        ),
        vgsc995f_vgsc995s_percent=get_string_key_val(
            datarow, "vgsc995f_vgsc995s_percent"
        ),
        vgsc995f_vgsc995c_n=get_string_key_val(datarow, "vgsc995f_vgsc995c_n"),
        vgsc995f_vgsc995c_percent=get_string_key_val(
            datarow, "vgsc995f_vgsc995c_percent"
        ),
        vgsc995l_vgsc995c_n=get_string_key_val(datarow, "vgsc995l_vgsc995s_n"),
        vgsc995f_vgsc995s_n=get_string_key_val(datarow, "vgsc995f_vgsc995c_n"),
    )
    run_query(conn, query)
    return id


def load_kdrGenotypeFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_kdrgenotypefrequencies_data.format(
        id=id,
        susceptible_susceptible_n=get_string_key_val(
            datarow, "susceptible_susceptible_n"
        ),
        susceptible_susceptible_percent=get_string_key_val(
            datarow, "susceptible_susceptible_percent"
        ),
        resistant_susceptible_n=get_string_key_val(datarow, "resistant_susceptible_n"),
        resistant_susceptible_percent=get_string_key_val(
            datarow, "resistant_susceptible_percent"
        ),
        resistant_resistant_n=get_string_key_val(datarow, "resistant_resistant_n"),
        resistant_resistant_percent=get_string_key_val(
            datarow, "resistant_resistant_percent"
        ),
    )
    run_query(conn, query)
    return id


def load_vgsc995AlleleFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_vgsc995allelefrequencies_data.format(
        id=id,
        vgsc995l_percent=get_string_key_val(datarow, "vgsc995l_percent"),
        vgsc995f_percent=get_string_key_val(datarow, "vgsc995f_percent"),
        vgsc995s_percent=get_string_key_val(datarow, "vgsc995s_percent"),
        vgsc995c_percent=get_string_key_val(datarow, "vgsc995c_percent"),
        kdr_percent=get_string_key_val(datarow, "kdr_percent"),
    )
    run_query(conn, query)
    return id


def load_vgsc402GenotypeFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_vgsc402GenotypeFrequencies_data.format(
        id=id,
        vgsc402v_vgsc402v_n=get_string_key_val(datarow, "vgsc402v_vgsc402v_n"),
        vgsc402v_vgsc402v_percent=get_string_key_val(
            datarow, "vgsc402v_vgsc402v_percent"
        ),
        vgsc402v_vgsc402l_n=get_string_key_val(datarow, "vgsc402v_vgsc402l_n"),
        vgsc402v_vgsc402l_percent=get_string_key_val(
            datarow, "vgsc402v_vgsc402l_percent"
        ),
        vgsc402l_vgsc402l_n=get_string_key_val(datarow, "vgsc402l_vgsc402l_n"),
        vgsc402l_vgsc402l_percent=get_string_key_val(
            datarow, "vgsc402l_vgsc402l_percent"
        ),
    )
    run_query(conn, query)
    return id


def load_vgsc402AlleleFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_vgsc402AlleleFrequencies_data.format(
        id=id,
        vgsc402v_percent=get_string_key_val(datarow, "vgsc402v_percent"),
        vgsc_402l_percent=get_string_key_val(datarow, "vgsc_402l_percent"),
    )
    run_query(conn, query)
    return id


def load_cyp6aapAlleleFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_cyp6aapAlleleFrequencies_data.format(
        id=id,
        cyp6aap_wt_percent=get_string_key_val(datarow, "cyp6aap_wt_percent"),
        cyp6aap_dup1_percent=get_string_key_val(datarow, "cyp6aap_dup1_percent"),
    )
    run_query(conn, query)
    return id


def load_cyp6aapGenotypeFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_cyp6aapGenotypeFrequencies_data.format(
        id=id,
        cyp6aap_wt_percent=get_string_val(""),
        cyp6aap_wt_cyp6aap_wt_n=get_string_key_val(datarow, "cyp6aap_wt_cyp6aap_wt_n"),
        cyp6aap_wt_cyp6aap_wt_percent=get_string_key_val(
            datarow, "cyp6aap_wt_cyp6aap_wt_percent"
        ),
        cyp6aap_wt_cyp6aap_dup1_n=get_string_key_val(
            datarow, "cyp6aap_wt_cyp6aap_dup1_n"
        ),
        cyp6aap_wt_cyp6aap_dup1_percent=get_string_key_val(
            datarow, "cyp6aap_wt_cyp6aap_dup1_percent"
        ),
        cyp6aap_dup1_cyp6aap_dup1_n=get_string_key_val(
            datarow, "cyp6aap_dup1_cyp6aap_dup1_n"
        ),
        cyp6aap_dup1_cyp6aap_dup1_percent=get_string_key_val(
            datarow, "cyp6aap_dup1_cyp6aap_dup1_percent"
        ),
    )
    run_query(conn, query)
    return id


def load_cyp6p4AlleleFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_cyp6p4AlleleFrequencies_data.format(
        id=id,
        cyp6p4_236wt_percent=get_string_key_val(datarow, "cyp6p4_236wt_percent"),
        cyp6p4_236m_percent=get_string_key_val(datarow, "cyp6p4_236m_percent"),
    )
    run_query(conn, query)
    return id


def load_cyp6p4GenotypeFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_cyp6p4GenotypeFrequencies_data.format(
        id=id,
        cyp6p4_236wt_cyp6p4_236wt_n=get_string_key_val(
            datarow, "cyp6p4_236wt_cyp6p4_236wt_n"
        ),
        cyp6p4_236wt_cyp6p4_236wt_percent=get_string_key_val(
            datarow, "cyp6p4_236wt_cyp6p4_236wt_percent"
        ),
        cyp6p4_236wt_cyp6p4_236m_n=get_string_key_val(
            datarow, "cyp6p4_236wt_cyp6p4_236m_n"
        ),
        cyp6p4_236wt_cyp6p4_236m_percent=get_string_key_val(
            datarow, "cyp6p4_236wt_cyp6p4_236m_percent"
        ),
        cyp6p4_236m_cyp6p4_236m_n=get_string_key_val(
            datarow, "cyp6p4_236m_cyp6p4_236m_n"
        ),
        cyp6p4_236m_cyp6p4_236m_percent=get_string_key_val(
            datarow, "cyp6p4_236m_cyp6p4_236m_percent"
        ),
    )
    run_query(conn, query)
    return id


def load_cyp4j5AlleleFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_cyp4j5AlleleFrequencies_data.format(
        id=id,
        cyp4j5_43l_percent=get_string_key_val(datarow, "cyp4j5_43l_percent"),
        cyp4j5_43f_percent=get_string_key_val(datarow, "cyp4j5_43f_percent"),
    )
    run_query(conn, query)
    return id


def load_cyp4j5GenotypeFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_cyp4j5GenotypeFrequencies_data.format(
        id=id,
        cyp4j5_43l_cyp4j5_43l_n=get_string_key_val(datarow, "cyp4j5_43l_cyp4j5_43l_n"),
        cyp4j5_43l_cyp4j5_43l_percent=get_string_key_val(
            datarow, "cyp4j5_43l_cyp4j5_43l_percent"
        ),
        cyp4j5_43l_cyp4j5_43f_n=get_string_key_val(datarow, "cyp4j5_43l_cyp4j5_43f_n"),
        cyp4j5_43l_cyp4j5_43f_percent=get_string_key_val(
            datarow, "cyp4j5_43l_cyp4j5_43f_percent"
        ),
        cyp4j5_43f_cyp4j5_43f_n=get_string_key_val(datarow, "cyp4j5_43f_cyp4j5_43f_n"),
        cyp4j5_43f_cyp4j5_43f_percent=get_string_key_val(
            datarow, "cyp4j5_43f_cyp4j5_43f_percent"
        ),
    )
    run_query(conn, query)
    return id


def load_cytochromesP450CypMethodAndSample_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_cytochromesP450_cypMethodAndSample_data.format(
        id=id,
        cyp_method_1=get_string_key_val(datarow, "cyp_method_1"),
        cyp_number_of_mosquitoes_tested=get_string_key_val(
            datarow, "cyp_number_of_mosquitoes_tested"
        ),
        cyp_generation=get_string_key_val(datarow, "cyp_generation"),
        cyp_notes=get_string_key_val(datarow, "cyp_notes"),
    )
    run_query(conn, query)
    return id


def load_gste2119AlleleFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_gste2_119AlleleFrequencies_data.format(
        id=id,
        gste2_119l_percent=get_string_key_val(datarow, "gste2_119l_percent"),
        gste2_119v_percent=get_string_key_val(datarow, "gste2_119v_percent"),
    )
    run_query(conn, query)
    return id


def load_gste2119GenotypeFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_gste2_119GenotypeFrequencies_data.format(
        id=id,
        gste2_119l_gste2_119l_n=get_string_key_val(datarow, "gste2_119l_gste2_119l_n"),
        gste2_119l_gste2_119l_percent=get_string_key_val(
            datarow, "gste2_119l_gste2_119l_percent"
        ),
        gste2_119l_gste2_119v_n=get_string_key_val(datarow, "gste2_119l_gste2_119v_n"),
        gste2_119l_gste2_119v_percent=get_string_key_val(
            datarow, "gste2_119l_gste2_119v_percent"
        ),
        gste2_119v_gste2_119v_n=get_string_key_val(datarow, "gste2_119v_gste2_119v_n"),
        gste2_119v_gste2_119v_percent=get_string_key_val(
            datarow, "gste2_119v_gste2_119v_percent"
        ),
    )
    run_query(conn, query)
    return id


def load_gste2114AlleleFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_gste2_114AlleleFrequencies_data.format(
        id=id,
        gste2_114I_percent=get_string_key_val(datarow, "gste2_114I_percent"),
        gste2_114t_percent=get_string_key_val(datarow, "gste2_114t_percent"),
    )
    run_query(conn, query)
    return id


def load_gste2114GenotypeFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_gste2_114GenotypeFrequencies_data.format(
        id=id,
        gste2_114I_gste2_114I_n=get_string_key_val(datarow, "gste2_114I_gste2_114I_n"),
        gste2_114I_gste2_114I_percent=get_string_key_val(
            datarow, "gste2_114I_gste2_114I_percent"
        ),
        gste2_114I_gste2_114t_n=get_string_key_val(datarow, "gste2_114I_gste2_114t_n"),
        gste2_114I_gste2_114t_percent=get_string_key_val(
            datarow, "gste2_114I_gste2_114t_percent"
        ),
        gste2_114t_gste2_114t_n=get_string_key_val(datarow, "gste2_114t_gste2_114t_n"),
        gste2_114t_gste2_114t_percent=get_string_key_val(
            datarow, "gste2_114t_gste2_114t_percent"
        ),
    )
    run_query(conn, query)
    return id


def load_vgsc1570GenotypeFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_vgsc1570GenotypeFrequencies_data.format(
        id=id,
        vgsc1570n_vgsc1570n_n=get_string_key_val(datarow, "vgsc1570n_vgsc1570n_n"),
        vgsc1570n_vgsc1570n_percent=get_string_key_val(
            datarow, "vgsc1570n_vgsc1570n_percent"
        ),
        vgsc1570n_vgsc1570y_n=get_string_key_val(datarow, "vgsc1570n_vgsc1570y_n"),
        vgsc1570n_1570y_percent=get_string_key_val(datarow, "vgsc1570n_1570y_percent"),
        vgsc1570y_vgsc1570y_n=get_string_key_val(datarow, "vgsc1570y_vgsc1570y_n"),
        vgsc1570y_vgsc1570y_percent=get_string_key_val(
            datarow, "vgsc1570y_vgsc1570y_percent"
        ),
    )
    run_query(conn, query)
    return id


def load_vgsc1570AlleleFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_vgsc1570AlleleFrequencies_data.format(
        id=id,
        vgsc1570n_percent=get_string_key_val(datarow, "vgsc1570n_percent"),
        vgsc1570y_percent=get_string_key_val(datarow, "vgsc1570y_percent"),
    )
    run_query(conn, query)
    return id


def load_rdlMethodAndSample_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_rdlMethodAndSample_data.format(
        id=id,
        rdl_method_1=get_string_key_val(datarow, "rdl_method_1"),
        rdl_number_of_mosquitoes_tested=get_string_key_val(
            datarow, "rdl_number_of_mosquitoes_tested"
        ),
        rdl_generation=get_string_key_val(datarow, "rdl_generation"),
        rdl_notes=get_string_key_val(datarow, "rdl_notes"),
    )
    run_query(conn, query)
    return id


def load_rdl296GenotypeFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_rdl296GenotypeFrequencies_data.format(
        id=id,
        rdl296c_rdl296c_n=get_string_key_val(datarow, "rdl296c_rdl296c__n"),
        rdl296c_rdl296c_percent=get_string_key_val(datarow, "rdl296c_rdl296c_percent"),
        rdl296c_rdl296g_n=get_string_key_val(datarow, "rdl296c_rdl296g_n"),
        rdl296c_rdl296g_percent=get_string_key_val(datarow, "rdl296c_rdl296g_percent"),
        rdl296g_rdl296g_n=get_string_key_val(datarow, "rdl296g_rdl296g_n"),
        rdl296g_rdl296g_percent=get_string_key_val(datarow, "rdl296g_rdl296g_percent"),
        rdl296c_rdl296s_n=get_string_key_val(datarow, "rdl296c_rdl296s_n"),
        rdl296c_rdl296s_percent=get_string_key_val(datarow, "rdl296c_rdl296s_percent"),
        rdl296s_rdl296s_n=get_string_key_val(datarow, "rdl296s_rdl296s_n"),
        rdl296s_rdl296s_percent=get_string_key_val(datarow, "rdl296s_rdl296s_percent"),
        rdl296g_rdl296s_n=get_string_key_val(datarow, "rdl296g_rdl296s_n"),
        rdl296g_rdl296s_percent=get_string_key_val(datarow, "rdl296g_rdl296s_percent"),
    )
    run_query(conn, query)
    return id


def load_rdl296AlleleFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_rdl296AlleleFrequencies_data.format(
        id=id,
        rdl296c_percent=get_string_key_val(datarow, "rdl296c_percent"),
        rdl296g_percent=get_string_key_val(datarow, "rdl296g_percent"),
        rdl296s_percent=get_string_key_val(datarow, "rdl296s_percent"),
    )
    run_query(conn, query)
    return id


def load_ace1MethodAndSample_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_ace1MethodAndSample_data.format(
        id=id,
        ace1_method_1=get_string_key_val(datarow, "ace1_method_1"),
        ace1_number_of_mosquitoes_tested=get_string_key_val(
            datarow, "ace1_number_of_mosquitoes_tested"
        ),
        ace1_generation=get_string_key_val(datarow, "ace1_generation"),
        ace1_notes=get_string_key_val(datarow, "ace1_notes"),
    )
    run_query(conn, query)
    return id


def load_ace1GenotypeFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_ace1GenotypeFrequencies_data.format(
        id=id,
        ace1_280g_ace1_280g_n=get_string_key_val(datarow, "ace1_280g_ace1_280g_n"),
        ace1_280g_ace1_280g_percent=get_string_key_val(
            datarow, "ace1_280g_ace1_280g_percent"
        ),
        ace1_280g_ace1_280s_n=get_string_key_val(datarow, "ace1_280g_ace1_280s_n"),
        ace1_280g_ace1_280s_percent=get_string_key_val(
            datarow, "ace1_280g_ace1_280s_percent"
        ),
        ace1_280s_ace1_280s_n=get_string_key_val(datarow, "ace1_280s_ace1_280s_n"),
        ace1_280s_ace1_280s_percent=get_string_key_val(
            datarow, "ace1_280s_ace1_280s_percent"
        ),
    )
    run_query(conn, query)
    return id


def load_ace1AlleleFrequencies_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_ace1AlleleFrequencies_data.format(
        id=id,
        ace1_280g_percent=get_string_key_val(datarow, "ace1_280g_percent"),
        ace1_280s_percent=get_string_key_val(datarow, "ace1_280s_percent"),
    )
    run_query(conn, query)
    return id


def load_gsteMethodAndSample_data(conn, datarow) -> str:
    # _record_exist = record_exist(conn, query=template_select_reference_data.format(
    #         year = get_int_val(data_row["publication year"]),
    #         citation = get_string_key_val(data_row, "citation_doi"])
    #     ))
    # if _record_exist:
    #     return _record_exist
    # else:

    id = get_uuid()
    query = template_insert_gsteMethodAndSample_data.format(
        id=id,
        gste_method_1=get_string_key_val(datarow, "gste_method_1"),
        gste_number_of_mosquitoes_tested=get_string_key_val(
            datarow, "gste_number_of_mosquitoes_tested"
        ),
        gste_generation=get_string_key_val(datarow, "gste_generation"),
        gste_notes=get_string_key_val(datarow, "gste_notes"),
    )
    run_query(conn, query)
    return id
