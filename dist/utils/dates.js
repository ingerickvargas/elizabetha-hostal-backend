"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDateOverlap = void 0;
const hasDateOverlap = (existingStart, existingEnd, requestedStart, requestedEnd) => {
    return existingStart < requestedEnd && existingEnd > requestedStart;
};
exports.hasDateOverlap = hasDateOverlap;
