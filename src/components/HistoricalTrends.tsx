import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, Download, Calendar, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';

interface TrendData {
  time: string;
  threats: number;
  anomalies: number;
  normalEvents: number;
}

export function HistoricalTrends() {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [trendData, setTrendData] = useState<TrendData[]>([]);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState<number>(-1); // -1 means show all
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Generate mock historical data based on time range
    const generateData = () => {
      const points =
        timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 14 : 30;
      return Array.from({ length: points }, (_, i) => ({
        time:
          timeRange === '1h'
            ? `${String(i * 5).padStart(2, '0')}m`
            : timeRange === '24h'
            ? `${String(i).padStart(2, '0')}:00`
            : timeRange === '7d'
            ? `Day ${i + 1}`
            : `Day ${i + 1}`,
        threats: Math.floor(Math.random() * 50) + 10,
        anomalies: Math.floor(Math.random() * 20) + 5,
        normalEvents: Math.floor(Math.random() * 100) + 50,
      }));
    };
    const data = generateData();
    setTrendData(data);
    setPlaybackIndex(data.length - 1); // Reset playback to end when range changes
    setIsPlaying(false);
  }, [timeRange]);

  useEffect(() => {
    if (isPlaying) {
      playbackIntervalRef.current = setInterval(() => {
        setPlaybackIndex((prev) => {
          if (prev >= trendData.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 500); // 500ms per step
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    }
    return () => {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    };
  }, [isPlaying, trendData.length]);

  const togglePlay = () => {
    if (playbackIndex >= trendData.length - 1) {
      setPlaybackIndex(0); // Restart if at end
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (value: number[]) => {
    setPlaybackIndex(value[0]);
    setIsPlaying(false); // Pause on manual scrub
  };

  const exportData = () => {
    const csv = [
      ['Time', 'Threats', 'Anomalies', 'Normal Events'],
      ...trendData.map((d) => [d.time, d.threats, d.anomalies, d.normalEvents]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-trends-${timeRange}-${Date.now()}.csv`;
    a.click();
  };

  // Calculate metrics based on current playback index
  const visibleData = trendData.slice(0, playbackIndex + 1);
  const totalThreats = visibleData.reduce((sum, d) => sum + d.threats, 0);
  const avgThreats = visibleData.length > 0 ? Math.round(totalThreats / visibleData.length) : 0;
  const currentTrendPoint = visibleData[visibleData.length - 1];
  const firstTrendPoint = visibleData[0];
  const trend =
    visibleData.length > 1 && firstTrendPoint.threats > 0
      ? ((currentTrendPoint.threats - firstTrendPoint.threats) / firstTrendPoint.threats) * 100
      : 0;

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='w-5 h-5' />
              Historical Trends
            </CardTitle>
            <CardDescription>
              Threat activity over time
              {playbackIndex < trendData.length - 1 && (
                <span className='text-amber-500 ml-2'>(Playback Mode)</span>
              )}
            </CardDescription>
          </div>
          <div className='flex gap-2'>
            <Button size='sm' variant='outline' onClick={exportData}>
              <Download className='w-4 h-4 mr-2' />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Time Range Selector */}
        <div className='flex justify-between items-center mb-6'>
          <div className='flex gap-2'>
            {(['1h', '24h', '7d', '30d'] as const).map((range) => (
              <Button
                key={range}
                size='sm'
                variant={timeRange === range ? 'default' : 'outline'}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>

          {/* Playback Controls */}
          <div className='flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg'>
            <Button
              size='icon'
              variant='ghost'
              className='h-8 w-8'
              onClick={() => setPlaybackIndex(0)}
              disabled={playbackIndex === 0}
            >
              <SkipBack className='w-4 h-4' />
            </Button>
            <Button
              size='icon'
              variant={isPlaying ? 'destructive' : 'default'}
              className='h-8 w-8'
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='h-8 w-8'
              onClick={() => setPlaybackIndex(trendData.length - 1)}
              disabled={playbackIndex >= trendData.length - 1}
            >
              <SkipForward className='w-4 h-4' />
            </Button>
          </div>
        </div>

        {/* Playback Slider */}
        <div className='mb-6 px-2'>
          <Slider
            value={[playbackIndex]}
            max={trendData.length - 1}
            step={1}
            onValueChange={handleSliderChange}
            className='my-4'
          />
          <div className='flex justify-between text-xs text-muted-foreground'>
            <span>Start</span>
            <span>{visibleData.length > 0 ? visibleData[visibleData.length - 1].time : ''}</span>
            <span>End</span>
          </div>
        </div>

        {/* Metrics Summary */}
        <div className='grid grid-cols-3 gap-4 mb-6'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='p-3 bg-card border border-border/50 rounded-lg'
          >
            <div className='text-2xl font-bold text-red-500'>{totalThreats}</div>
            <div className='text-xs text-muted-foreground'>Total Threats (Visible)</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='p-3 bg-card border border-border/50 rounded-lg'
          >
            <div className='text-2xl font-bold text-primary'>{avgThreats}</div>
            <div className='text-xs text-muted-foreground'>Avg per Period</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='p-3 bg-card border border-border/50 rounded-lg'
          >
            <div className={`text-2xl font-bold ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {trend > 0 ? '+' : ''}
              {trend.toFixed(1)}%
            </div>
            <div className='text-xs text-muted-foreground'>Trend</div>
          </motion.div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width='100%' height={250}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id='threatsGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#ef4444' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#ef4444' stopOpacity={0} />
              </linearGradient>
              <linearGradient id='anomaliesGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#f59e0b' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#f59e0b' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
            <XAxis
              dataKey='time'
              stroke='hsl(var(--muted-foreground))'
              style={{ fontSize: '10px' }}
            />
            <YAxis stroke='hsl(var(--muted-foreground))' style={{ fontSize: '10px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <ReferenceLine
              x={visibleData.length > 0 ? visibleData[visibleData.length - 1].time : ''}
              stroke='hsl(var(--primary))'
              strokeDasharray='3 3'
            />
            {/* We use playbackIndex to mask the area? Or just slice the data? 
                            If we actally slice the data passed to AreaChart, the XAxis might shrink/grow, which is jarring.
                            Better to keep all data but only fill up to playbackIndex.
                            Recharts doesn't easily support partial fill based on index.
                            Alternative: Pass full data, but set values to null after playbackIndex?
                        */}
            <Area
              type='monotone'
              dataKey='threats'
              stroke='#ef4444'
              fillOpacity={1}
              fill='url(#threatsGradient)'
              // Trick: we can't easily animate the 'data' prop without re-rendering axis.
              // But since we want to 'replay', re-rendering is fine.
              // To prevent axis jumping, we can keep the XAxis static if we knew the full domain.
              // But here, simplest is to just slice data. However, that changes the X-axis scale.
              // Better approach: Use null for future values to keep X-axis stable.
              data={trendData.map((d, i) =>
                i <= playbackIndex ? d : { ...d, threats: null, anomalies: null },
              )}
              connectNulls={false}
            />
            <Area
              type='monotone'
              dataKey='anomalies'
              stroke='#f59e0b'
              fillOpacity={1}
              fill='url(#anomaliesGradient)'
              data={trendData.map((d, i) =>
                i <= playbackIndex ? d : { ...d, threats: null, anomalies: null },
              )}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
