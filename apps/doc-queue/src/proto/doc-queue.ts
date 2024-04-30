/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "docs";

export interface DocQueueListRequest {
  bookingNumber: string;
  page: number;
  size: number;
}

export interface DocQueueListResponse {
  status: number;
  code: number;
  message: string;
  data: DocQueuePagination | undefined;
}

export interface DocQueuePagination {
  total: number;
  items: DocQueueItem[];
}

export interface DocQueueItem {
  queueNumber: string;
  bookingNumber: string;
  isEsiAttached: boolean;
  isEmailSiAttached: boolean;
  totalSi: number;
  timeLeft: string;
  priority: string;
  picId: string;
  siKind: string;
  isBlDocumentInput: boolean;
  isBlRate: boolean;
  isBlAudit: boolean;
  isBlDraftFaxOut: boolean;
  siProcessingStatus: string;
  siSourceChannel: string;
  processingTool: string;
  esiUploadStatus: string;
  shineUploadStatus: string;
  queueRemark: string;
  timeLeftCategory: string;
  splitStatusCode: string;
  siReceivedAt: number;
  siTransferredAt: number;
  queueStatus: number;
  createdAt: number;
  createdBy: string;
  updatedAt: number;
  updatedBy: string;
  id: string;
  bookingInfo: BookingInfo | undefined;
  inquiryStatus: InquiryStatus | undefined;
  amsDue: string;
}

export interface BookingInfo {
  queueNumber: string;
  bookingStaffName: string;
  cargoReceivedAt: number;
  serviceLaneCode: string;
  vvd: string;
  mf: string;
  polCode: string;
  etd: number;
  dct: number;
  bookingOfficeCode: string;
  outboundSaleOfficeCode: string;
  outboundRepresentativeOfficeCode: string;
  shipperName: string;
  podCode: string;
  bdr: number;
  isDangerCargo: boolean;
  isReeferCargo: boolean;
  isAwkwardCargo: boolean;
  isBbCargo: boolean;
}

export interface InquiryStatus {
  queueNumber: string;
  lastestInquiryStatus: string;
  inquiryChannel: string;
  blInquiryStatus: string;
  resolvedInquiry: string;
  resolvedAmendment: string;
  inquiryFrequency: number;
  inquiryNewReply: number;
  returnFromUserId: string;
  returnToUserId: string;
}

export interface UpdateSiProcessingStatusRequest {
  docQueueId: string;
  status: string;
}

export interface UpdateSiProcessingStatusResponse {
  status: number;
  code: number;
  message: string;
  data: boolean;
}

export interface GetActionGoToBookingRequest {
  docQueueId: string;
}

export interface Button {
  label: string;
  url: string;
}

export interface Arguments {
  /** this will be null for action "redirect" */
  title: string;
  /** this will be null for action "redirect" */
  description: string;
  url: string;
  /** this will be null for action "redirect" */
  buttons: Button[];
}

export interface ActionGoToBookingPayload {
  action: string;
  args: Arguments | undefined;
}

export interface GetActionGoToBookingResponse {
  status: number;
  code: number;
  message: string;
  data: ActionGoToBookingPayload | undefined;
}

export const DOCS_PACKAGE_NAME = "docs";

export interface DocQueueServiceClient {
  getDocQueueList(request: DocQueueListRequest, metadata?: Metadata): Observable<DocQueueListResponse>;

  updateSiProcessingStatus(
    request: UpdateSiProcessingStatusRequest,
    metadata?: Metadata,
  ): Observable<UpdateSiProcessingStatusResponse>;

  getActionGoToBooking(
    request: GetActionGoToBookingRequest,
    metadata?: Metadata,
  ): Observable<GetActionGoToBookingResponse>;
}

export interface DocQueueServiceController {
  getDocQueueList(
    request: DocQueueListRequest,
    metadata?: Metadata,
  ): Promise<DocQueueListResponse> | Observable<DocQueueListResponse> | DocQueueListResponse;

  updateSiProcessingStatus(
    request: UpdateSiProcessingStatusRequest,
    metadata?: Metadata,
  ):
    | Promise<UpdateSiProcessingStatusResponse>
    | Observable<UpdateSiProcessingStatusResponse>
    | UpdateSiProcessingStatusResponse;

  getActionGoToBooking(
    request: GetActionGoToBookingRequest,
    metadata?: Metadata,
  ): Promise<GetActionGoToBookingResponse> | Observable<GetActionGoToBookingResponse> | GetActionGoToBookingResponse;
}

export function DocQueueServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getDocQueueList", "updateSiProcessingStatus", "getActionGoToBooking"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("DocQueueService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("DocQueueService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const DOC_QUEUE_SERVICE_NAME = "DocQueueService";
