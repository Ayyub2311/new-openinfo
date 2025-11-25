export class FormatDateBase {
  formatDate(dateString: string): string {
    // Normalize and parse the input string
    const date = new Date(dateString);

    // Handle invalid dates
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format. Unable to parse the date.");
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
}
