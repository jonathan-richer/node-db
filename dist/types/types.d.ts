export declare type row = {
    name: string;
    type: "string" | "number" | "boolean";
    default?: any;
    options?: {
        notnull?: boolean;
        autoIncrement?: boolean;
    };
};
