import PropTypes from 'prop-types';
/** Render an administrator statistic. */
export default function StatCard({ label, value, tone }) { return <article className={`rounded-xl p-5 shadow-sm ${tone}`}><p className="text-sm font-medium">{label}</p><p className="mt-2 text-3xl font-bold tabular-nums">{value}</p></article>; }
StatCard.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.number.isRequired, tone: PropTypes.string.isRequired };