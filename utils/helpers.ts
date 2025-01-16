export const saveToFile = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};

export const loadFromFile = (file: File, callback: (data: any) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = JSON.parse(e.target?.result as string);
        callback(data);
    };
    reader.readAsText(file);
};
