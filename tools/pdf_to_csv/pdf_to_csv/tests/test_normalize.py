from pdf_to_csv.normalize import (
    canonical_column,
    clean_name_token,
    fuzzy_canonical_column,
    is_summary_row,
    parse_number,
    split_first_last,
    split_hometown_school,
)


def test_canonical_column_known_aliases():
    assert canonical_column("#") == "Number"
    assert canonical_column("No.") == "Number"
    assert canonical_column("K") == "SO"
    assert canonical_column("B/AVG") == "BAA"
    assert canonical_column("HOMETOWN/HIGH SCHOOL") == "Hometown"


def test_canonical_column_case_insensitive_fallback():
    assert canonical_column("hr") == "HR"
    assert canonical_column("Era") == "ERA"


def test_canonical_column_unknown():
    assert canonical_column("Mystery") is None
    assert canonical_column("") is None


def test_fuzzy_canonical_column_handles_typos():
    assert fuzzy_canonical_column("Hieght") == "Height"
    assert fuzzy_canonical_column("Hometwn") == "Hometown"


def test_parse_number_handles_dashes_and_blanks():
    assert parse_number("-") == 0.0
    assert parse_number("--") == 0.0
    assert parse_number("") == 0.0
    assert parse_number(None) == 0.0
    assert parse_number(".418") == 0.418
    assert parse_number("42.0") == 42.0
    assert parse_number("1,234") == 1234.0
    assert parse_number("57.49%") == 57.49


def test_clean_name_token_strips_padding():
    assert clean_name_token("Sean Togher.........") == "Sean Togher"
    assert clean_name_token("Total...............") == "Total"
    assert clean_name_token("  Smith  ") == "Smith"


def test_split_first_last_handles_orderings():
    assert split_first_last("Sean Togher") == ("Sean", "Togher")
    assert split_first_last("Togher, Sean") == ("Sean", "Togher")
    assert split_first_last("Roy Higinbotham") == ("Roy", "Higinbotham")
    assert split_first_last("De La Cruz, Carlos") == ("Carlos", "De La Cruz")
    assert split_first_last("John Paul Smith") == ("John Paul", "Smith")
    # Single-token name lands in Last so importer's required field stays populated.
    assert split_first_last("Cher") == ("", "Cher")


def test_split_hometown_school():
    assert split_hometown_school("Sheridan, WY / Sheridan HS") == (
        "Sheridan, WY",
        "Sheridan HS",
    )
    assert split_hometown_school("Bonham, TX /") == ("Bonham, TX", "")
    assert split_hometown_school("") == ("", "")


def test_is_summary_row():
    assert is_summary_row("Total...............") is True
    assert is_summary_row("Opponents...........") is True
    assert is_summary_row("31") is False
    assert is_summary_row("Sean Togher") is False
