import React from 'react';
import { Layout } from '../components/Layout';
import { PageHero, SectionCard } from '../components/admin-ui';
import { Button } from '../components/ui/button';
import { FileText, Download } from 'lucide-react';

export const Reports = () => {
  const reports = [
    { id: 1, name: 'Daily Revenue Report', period: 'Jun 30, 2026', size: '24 KB' },
    { id: 2, name: 'Weekly Summary', period: 'Jun 24-30, 2026', size: '48 KB' },
    { id: 3, name: 'Monthly Performance', period: 'June 2026', size: '156 KB' },
    { id: 4, name: 'Tax Report', period: 'Q2 2026', size: '82 KB' },
  ];

  return (
    <Layout title="Reports" breadcrumb="Reports" searchPlaceholder="Search reports...">
      <div className="space-y-6">
        <PageHero
          title="Reports"
          subtitle="Daily, weekly, and monthly revenue reports — export to CSV"
          actions={<Button size="sm"><Download className="mr-1.5 h-4 w-4" /> Export All</Button>}
        />

        <SectionCard icon={FileText} title="Available Reports" description="Download detailed financial reports">
          <div className="space-y-2">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-primary">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium text-[#1E2D4A]">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.period} · {report.size}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  CSV
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </Layout>
  );
};
