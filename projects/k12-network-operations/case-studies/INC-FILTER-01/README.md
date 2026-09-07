# INC-FILTER-01 — Approved Instructional SaaS Blocked

## Executive Summary

A teacher can browse normally and authenticate to an instructional SaaS application, but the application fails when it calls a newly categorized API endpoint. DNS and TCP connectivity succeed; the web-filter log identifies the exact dependency being blocked for the STAFF policy. A narrow FQDN exception is approved for the required group, and a STUDENT control test confirms that unrelated filtering remains intact.

## Engineering Value

This case demonstrates why “the website is blocked” should not result in disabling filtering or broadly allowing an entire cloud/CDN provider.

## Evidence Files

- [`evidence/filter-event.json`](evidence/filter-event.json)
- [`evidence/service-tests.txt`](evidence/service-tests.txt)
- [`evidence/dependencies.csv`](evidence/dependencies.csv)
- [`change-record.md`](change-record.md)
- [`validation.txt`](validation.txt)
