"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceError = void 0;
class ServiceError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = "ServiceError";
    }
}
exports.ServiceError = ServiceError;
//# sourceMappingURL=errors.js.map