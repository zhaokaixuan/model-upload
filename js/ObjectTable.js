function getRow(id) {
    var row = $("#object-table tbody").find('td').filter(function () {
        return $(this).text() == id.toString();
    }).closest("tr");
    return row;
}