// Google Workspace API Helper Functions (Drive, Sheets, Docs)

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
}

/**
 * GOOGLE DRIVE API FUNCTIONS
 */

// List files in Google Drive
export const listDriveFiles = async (
  accessToken: string,
  filterType?: "all" | "sheets" | "docs"
): Promise<DriveFile[]> => {
  let q = "trashed = false";
  if (filterType === "sheets") {
    q += " and mimeType = 'application/vnd.google-apps.spreadsheet'";
  } else if (filterType === "docs") {
    q += " and mimeType = 'application/vnd.google-apps.document'";
  }

  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    q
  )}&fields=files(id,name,mimeType,webViewLink,createdTime,modifiedTime,size)&pageSize=50&orderBy=modifiedTime desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error?.message || "Gagal mengambil daftar file dari Google Drive"
    );
  }

  const data = await response.json();
  return data.files || [];
};

// Upload plain text / markdown file to Google Drive
export const uploadFileToDrive = async (
  accessToken: string,
  fileName: string,
  content: string,
  mimeType: string = "text/plain"
): Promise<DriveFile> => {
  const metadata = {
    name: fileName,
    mimeType: mimeType,
  };

  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append("file", new Blob([content], { type: mimeType }));

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error?.message || "Gagal mengunggah file ke Google Drive"
    );
  }

  return await response.json();
};

// Delete file from Google Drive (with user confirmation requirement in UI)
export const deleteFileFromDrive = async (
  accessToken: string,
  fileId: string
): Promise<boolean> => {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok && response.status !== 204) {
    const errorData = await response.json();
    throw new Error(
      errorData.error?.message || "Gagal menghapus file dari Google Drive"
    );
  }

  return true;
};

/**
 * GOOGLE SHEETS API FUNCTIONS
 */

export interface SheetDataGrid {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}

// Create a new Google Spreadsheet with custom sheet grids
export const createGoogleSheet = async (
  accessToken: string,
  spreadsheetTitle: string,
  grids: SheetDataGrid[]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const sheetsPayload = grids.map((grid) => {
    const headerRow = {
      values: grid.headers.map((h) => ({
        userEnteredValue: { stringValue: String(h) },
        userEnteredFormat: {
          backgroundColor: { red: 0.24, green: 0.25, blue: 0.21 }, // #3D4035
          textFormat: { bold: true, foregroundColor: { red: 0.98, green: 0.97, blue: 0.96 } },
        },
      })),
    };

    const dataRows = grid.rows.map((row) => ({
      values: row.map((cell) => {
        if (typeof cell === "number") {
          return { userEnteredValue: { numberValue: cell } };
        }
        return { userEnteredValue: { stringValue: String(cell ?? "") } };
      }),
    }));

    return {
      properties: { title: grid.title },
      data: [
        {
          startRow: 0,
          startColumn: 0,
          rowData: [headerRow, ...dataRows],
        },
      ],
    };
  });

  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: { title: spreadsheetTitle },
      sheets: sheetsPayload,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error?.message || "Gagal membuat Google Spreadsheet"
    );
  }

  const data = await response.json();
  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
  };
};

/**
 * GOOGLE DOCS API FUNCTIONS
 */

// Create a new Google Document with structured text
export const createGoogleDoc = async (
  accessToken: string,
  documentTitle: string,
  textContent: string
): Promise<{ documentId: string; documentUrl: string }> => {
  // 1. Create document
  const createRes = await fetch("https://docs.googleapis.com/v1/documents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: documentTitle,
    }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json();
    throw new Error(
      errorData.error?.message || "Gagal membuat dokumen Google Docs"
    );
  }

  const docData = await createRes.json();
  const documentId = docData.documentId;

  // 2. Insert text content into document
  if (textContent.trim()) {
    const batchRes = await fetch(
      `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                location: { index: 1 },
                text: `${documentTitle.toUpperCase()}\n${"=".repeat(
                  documentTitle.length
                )}\n\n${textContent}`,
              },
            },
          ],
        }),
      }
    );

    if (!batchRes.ok) {
      console.warn("Doc text insert warning:", await batchRes.json());
    }
  }

  return {
    documentId,
    documentUrl: `https://docs.google.com/document/d/${documentId}/edit`,
  };
};
