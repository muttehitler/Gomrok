import ResultDto from "./resultDto";

export default interface DataResultDto<T> extends ResultDto {
    data: T
}